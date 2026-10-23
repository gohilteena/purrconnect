// Full QA Automated Verification Script for PurrConnect
const http = require('http');

const API_BASE = 'http://localhost:5000/api';

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let parsed = null;
        try {
          parsed = data ? JSON.parse(data) : null;
        } catch (e) {
          parsed = data;
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed
        });
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

const results = {
  passed: [],
  failed: []
};

function assert(condition, message) {
  if (condition) {
    results.passed.push(message);
    console.log(`  [PASS] ${message}`);
  } else {
    results.failed.push(message);
    console.error(`  [FAIL] ${message}`);
  }
}

async function runQA() {
  console.log('====================================================');
  console.log(' PURRCONNECT FINAL FULL QA AUTOMATED SUITE');
  console.log('====================================================\n');

  // --- SECTION 1: BACKEND HEALTH & MONGODB ---
  console.log('--- 1. Backend Health & Database Connection ---');
  try {
    const health = await request('GET', '/health');
    assert(health.statusCode === 200, 'GET /api/health returned 200 OK');
    assert(health.data.success === true, 'Health check indicates success: true');
    assert(health.data.data.database === 'connected', 'Database connection status is "connected"');
  } catch (err) {
    assert(false, `Backend connection failed: ${err.message}`);
  }

  // --- SECTION 2: AUTHENTICATION & ACCESS CONTROL ---
  console.log('\n--- 2. Authentication & Protected Routes ---');
  let adminToken = null;
  try {
    // Invalid login
    const invalidLogin = await request('POST', '/auth/login', {
      email: 'invalid@example.com',
      password: 'WrongPassword123'
    });
    assert(invalidLogin.statusCode === 401, 'Invalid login rejected with HTTP 401');
    assert(invalidLogin.data.success === false, 'Invalid login response success === false');

    // Valid login
    const validLogin = await request('POST', '/auth/login', {
      email: 'gohilteena2005@gmail.com',
      password: 'Admin12345'
    });
    assert(validLogin.statusCode === 200, 'Valid admin login returned HTTP 200');
    assert(validLogin.data.data.token != null, 'Auth token returned in response');
    assert(validLogin.data.data.user.role === 'admin', 'Authenticated user role is "admin"');
    adminToken = validLogin.data.data.token;

    // Verify /auth/me with token
    const meRes = await request('GET', '/auth/me', null, {
      Authorization: `Bearer ${adminToken}`
    });
    assert(meRes.statusCode === 200, 'GET /api/auth/me with token returned HTTP 200');
    assert(meRes.data.data.user.email === 'gohilteena2005@gmail.com', '/api/auth/me returns correct admin email');

    // Verify protected route rejection without token
    const unauthCats = await request('POST', '/cats', { name: 'HackCat' });
    assert(unauthCats.statusCode === 401, 'POST /api/cats without token rejected with HTTP 401 Unauthorized');

    const unauthTestimonials = await request('POST', '/testimonials', { name: 'HackTestimonial' });
    assert(unauthTestimonials.statusCode === 401, 'POST /api/testimonials without token rejected with HTTP 401 Unauthorized');
  } catch (err) {
    assert(false, `Authentication testing failed: ${err.message}`);
  }

  const authHeader = { Authorization: `Bearer ${adminToken}` };

  // --- SECTION 3: DASHBOARD METRICS ---
  console.log('\n--- 3. Admin Dashboard Statistics ---');
  try {
    const statsRes = await request('GET', '/dashboard/stats', null, authHeader);
    assert(statsRes.statusCode === 200, 'GET /api/dashboard/stats returned HTTP 200');
    const stats = statsRes.data.data;
    assert(typeof stats.totalCats === 'number', `Stats totalCats is a number (${stats.totalCats})`);
    assert(typeof stats.availableCats === 'number', `Stats availableCats is a number (${stats.availableCats})`);
    assert(typeof stats.reservedCats === 'number', `Stats reservedCats is a number (${stats.reservedCats})`);
    assert(typeof stats.soldCats === 'number', `Stats soldCats is a number (${stats.soldCats})`);
    assert(typeof stats.totalEnquiries === 'number', `Stats totalEnquiries is a number (${stats.totalEnquiries})`);
    assert(typeof stats.newEnquiries === 'number', `Stats newEnquiries is a number (${stats.newEnquiries})`);
    assert(typeof stats.totalTestimonials === 'number', `Stats totalTestimonials is a number (${stats.totalTestimonials})`);
  } catch (err) {
    assert(false, `Dashboard stats failed: ${err.message}`);
  }

  // --- SECTION 4: PUBLIC WEBSITE - CATS DISCOVERY & FILTERS ---
  console.log('\n--- 4. Public Cats Discovery, Filters & Details ---');
  let firstCat = null;
  try {
    // 4.1 All cats listing
    const catsRes = await request('GET', '/cats?page=1&limit=10');
    assert(catsRes.statusCode === 200, 'GET /api/cats returns HTTP 200');
    assert(Array.isArray(catsRes.data.data.cats), 'Returned cats is an array');
    assert(catsRes.data.data.cats.length > 0, `Cats retrieved (${catsRes.data.data.cats.length} on page 1)`);
    firstCat = catsRes.data.data.cats[0];

    // 4.2 Featured cats
    const featuredRes = await request('GET', '/cats?featured=true');
    assert(featuredRes.statusCode === 200, 'GET /api/cats?featured=true returns HTTP 200');
    const allFeatured = featuredRes.data.data.cats.every(c => c.featured === true);
    assert(allFeatured, 'All returned cats from featured=true filter have featured === true');

    // 4.3 Search filter
    const searchRes = await request('GET', `/cats?search=${encodeURIComponent(firstCat.name)}`);
    assert(searchRes.statusCode === 200, `GET /api/cats?search=${firstCat.name} returns HTTP 200`);
    const foundFirst = searchRes.data.data.cats.some(c => c._id === firstCat._id);
    assert(foundFirst, `Search correctly finds cat by name "${firstCat.name}"`);

    // 4.4 Gender filter
    const gender = firstCat.gender;
    const genderRes = await request('GET', `/cats?gender=${gender}`);
    assert(genderRes.statusCode === 200, `GET /api/cats?gender=${gender} returns HTTP 200`);
    const allMatchingGender = genderRes.data.data.cats.every(c => c.gender === gender);
    assert(allMatchingGender, `Gender filter returns only "${gender}" cats`);

    // 4.5 Cat Detail by Slug & ID (route is /cats/:id which accepts ObjectId or slug)
    const catBySlug = await request('GET', `/cats/${firstCat.slug}`);
    assert(catBySlug.statusCode === 200, `GET /api/cats/${firstCat.slug} (slug) returns HTTP 200`);
    assert(catBySlug.data.data.cat._id === firstCat._id, 'Cat fetched by slug matches ID');

    const catById = await request('GET', `/cats/${firstCat._id}`);
    assert(catById.statusCode === 200, `GET /api/cats/${firstCat._id} (ID) returns HTTP 200`);
    assert(catById.data.data.cat.slug === firstCat.slug, 'Cat fetched by ID matches slug');
  } catch (err) {
    assert(false, `Public cats listing/detail failed: ${err.message}`);
  }

  // --- SECTION 5: CATS CRUD (ADMIN) & DATABASE PERSISTENCE ---
  console.log('\n--- 5. Admin Cat Management CRUD & Persistence ---');
  let createdCatId = null;
  try {
    // 5.1 Create Cat
    const newCatPayload = {
      name: 'QA Test Feline',
      breed: 'British Shorthair',
      gender: 'female',
      age: 2,
      ageUnit: 'years',
      color: 'Silver Tabby',
      price: 650,
      location: 'London, UK',
      description: 'A friendly test cat generated during full QA suite.',
      personality: ['Playful', 'Calm', 'Affectionate'],
      healthStatus: 'healthy',
      vaccinationStatus: 'fully_vaccinated',
      images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba'],
      status: 'available',
      featured: false
    };

    const createCatRes = await request('POST', '/cats', newCatPayload, authHeader);
    assert(createCatRes.statusCode === 201, 'POST /api/cats creates new cat with HTTP 201');
    assert(createCatRes.data.data.cat != null, 'Response contains cat object');
    assert(createCatRes.data.data.cat._id != null, 'Created cat has valid MongoDB _id');
    createdCatId = createCatRes.data.data.cat._id;

    // 5.2 Read & Verify Persistence in MongoDB
    const verifyCat = await request('GET', `/cats/${createdCatId}`);
    assert(verifyCat.statusCode === 200, 'GET /api/cats/:id reads newly created cat');
    assert(verifyCat.data.data.cat.name === 'QA Test Feline', 'Cat name persisted correctly');
    assert(verifyCat.data.data.cat.price === 650, 'Cat price persisted correctly');

    // 5.3 Update Cat (Status & Featured)
    const updateCatRes = await request('PUT', `/cats/${createdCatId}`, {
      status: 'reserved',
      featured: true,
      price: 700
    }, authHeader);
    assert(updateCatRes.statusCode === 200, 'PUT /api/cats/:id updates cat with HTTP 200');
    assert(updateCatRes.data.data.cat.status === 'reserved', 'Cat status updated to "reserved"');
    assert(updateCatRes.data.data.cat.featured === true, 'Cat featured updated to true');
    assert(updateCatRes.data.data.cat.price === 700, 'Cat price updated to 700');

    // 5.4 Verify Update Persistence in Database
    const verifyUpdatedCat = await request('GET', `/cats/${createdCatId}`);
    assert(verifyUpdatedCat.data.data.cat.status === 'reserved', 'Database confirms status is "reserved"');
    assert(verifyUpdatedCat.data.data.cat.featured === true, 'Database confirms featured is true');

    // 5.5 Delete Cat
    const deleteCatRes = await request('DELETE', `/cats/${createdCatId}`, null, authHeader);
    assert(deleteCatRes.statusCode === 200, 'DELETE /api/cats/:id deletes cat with HTTP 200');

    // 5.6 Verify Deletion Persistence in Database
    const verifyDeletedCat = await request('GET', `/cats/${createdCatId}`);
    assert(verifyDeletedCat.statusCode === 404, 'GET /api/cats/:id returns 404 Not Found after deletion');
  } catch (err) {
    assert(false, `Cat CRUD failed: ${err.message}`);
  }

  // --- SECTION 6: PUBLIC ENQUIRY & ADMIN ENQUIRY MANAGEMENT ---
  console.log('\n--- 6. Public Enquiry & Admin Management ---');
  let createdEnquiryId = null;
  try {
    // 6.1 Public user submits enquiry for firstCat
    const enquiryPayload = {
      name: 'Jane QA Tester',
      email: 'jane.qa@example.com',
      phone: '+44 7700 900123',
      cat: firstCat._id,
      message: 'Hello, I would love to adopt this lovely cat! Please get in touch.'
    };
    const submitEnquiry = await request('POST', '/enquiries', enquiryPayload);
    assert(submitEnquiry.statusCode === 201, 'POST /api/enquiries submits enquiry with HTTP 201');
    assert(submitEnquiry.data.data.enquiry != null, 'Response contains enquiry object');
    assert(submitEnquiry.data.data.enquiry._id != null, 'Enquiry generated valid MongoDB _id');
    createdEnquiryId = submitEnquiry.data.data.enquiry._id;

    // 6.2 Admin lists enquiries
    const listEnquiries = await request('GET', '/enquiries?page=1&limit=20', null, authHeader);
    assert(listEnquiries.statusCode === 200, 'GET /api/enquiries with admin token returns HTTP 200');
    const foundEnquiry = listEnquiries.data.data.enquiries.find(e => e._id === createdEnquiryId);
    assert(foundEnquiry != null, 'Admin can view the newly submitted enquiry');
    assert(foundEnquiry.status === 'new', 'Initial enquiry status is "new"');

    // 6.3 Admin updates enquiry status to 'contacted'
    const updateStatus = await request('PUT', `/enquiries/${createdEnquiryId}`, {
      status: 'contacted'
    }, authHeader);
    assert(updateStatus.statusCode === 200, 'PUT /api/enquiries/:id updates status to "contacted"');
    assert(updateStatus.data.data.enquiry.status === 'contacted', 'Returned enquiry has status "contacted"');

    // 6.4 Verify enquiry status persisted in database (re-fetch list)
    const refetchEnquiries = await request('GET', '/enquiries?page=1&limit=20', null, authHeader);
    const persistedEnquiry = refetchEnquiries.data.data.enquiries.find(e => e._id === createdEnquiryId);
    assert(persistedEnquiry.status === 'contacted', 'Database confirms enquiry status is "contacted"');
  } catch (err) {
    assert(false, `Enquiry flow failed: ${err.message}`);
  }

  // --- SECTION 7: TESTIMONIALS MANAGEMENT (ADMIN & PUBLIC) ---
  console.log('\n--- 7. Testimonials Management (Full Lifecycle) ---');
  let createdTestimonialId = null;
  try {
    // 7.1 Public testimonials retrieval (only approved)
    const publicTestimonials = await request('GET', '/testimonials');
    assert(publicTestimonials.statusCode === 200, 'GET /api/testimonials returns HTTP 200');
    const allApproved = publicTestimonials.data.data.testimonials.every(t => t.approved === true);
    assert(allApproved, 'Public testimonials endpoint only returns approved=true items');

    // 7.2 Admin retrieves all testimonials (including unapproved)
    const adminTestimonials = await request('GET', '/testimonials?approved=all&limit=50', null, authHeader);
    assert(adminTestimonials.statusCode === 200, 'GET /api/testimonials?approved=all returns HTTP 200');
    assert(Array.isArray(adminTestimonials.data.data.testimonials), 'Admin receives list of all testimonials');

    // 7.3 Admin creates a new testimonial
    const newTestimonialPayload = {
      name: 'Sarah QA Jenkins',
      location: 'Manchester, UK',
      catName: 'Whiskers',
      message: 'PurrConnect made finding our fur baby so effortless and joyful!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      approved: false
    };
    const createTestimonial = await request('POST', '/testimonials', newTestimonialPayload, authHeader);
    assert(createTestimonial.statusCode === 201, 'POST /api/testimonials creates testimonial with HTTP 201');
    assert(createTestimonial.data.data.testimonial != null, 'Response contains testimonial object');
    assert(createTestimonial.data.data.testimonial._id != null, 'Created testimonial has valid MongoDB _id');
    createdTestimonialId = createTestimonial.data.data.testimonial._id;

    // 7.4 Verify it is NOT visible on public endpoint yet (approved === false)
    const publicCheck1 = await request('GET', '/testimonials?limit=50');
    const isPublicYet = publicCheck1.data.data.testimonials.some(t => t._id === createdTestimonialId);
    assert(!isPublicYet, 'Unapproved testimonial is NOT visible on public endpoint');

    // 7.5 Admin edits testimonial
    const editTestimonial = await request('PUT', `/testimonials/${createdTestimonialId}`, {
      message: 'PurrConnect made finding our fur baby so effortless, joyful, and smooth!',
      rating: 5
    }, authHeader);
    assert(editTestimonial.statusCode === 200, 'PUT /api/testimonials/:id edits testimonial with HTTP 200');
    assert(editTestimonial.data.data.testimonial.message.includes('smooth!'), 'Edited message is reflected in response');

    // 7.6 Admin approves testimonial (PUT with approved: true)
    const approveRes = await request('PUT', `/testimonials/${createdTestimonialId}`, {
      approved: true
    }, authHeader);
    assert(approveRes.statusCode === 200, 'PUT /api/testimonials/:id sets approved=true');
    assert(approveRes.data.data.testimonial.approved === true, 'Testimonial approved status is true');

    // 7.7 Verify approved testimonial IS now visible on public endpoint
    const publicCheck2 = await request('GET', '/testimonials?limit=50');
    const isPublicNow = publicCheck2.data.data.testimonials.some(t => t._id === createdTestimonialId);
    assert(isPublicNow, 'Approved testimonial IS now visible on public endpoint');

    // 7.8 Admin unapproves testimonial (PUT with approved: false)
    const unapproveRes = await request('PUT', `/testimonials/${createdTestimonialId}`, {
      approved: false
    }, authHeader);
    assert(unapproveRes.statusCode === 200, 'PUT /api/testimonials/:id sets approved=false');
    assert(unapproveRes.data.data.testimonial.approved === false, 'Testimonial approved status is false');

    // 7.9 Verify unapproved testimonial disappears from public endpoint
    const publicCheck3 = await request('GET', '/testimonials?limit=50');
    const isPublicAfterUnapprove = publicCheck3.data.data.testimonials.some(t => t._id === createdTestimonialId);
    assert(!isPublicAfterUnapprove, 'Unapproved testimonial is no longer visible on public endpoint');

    // 7.10 Admin deletes testimonial
    const deleteTestimonial = await request('DELETE', `/testimonials/${createdTestimonialId}`, null, authHeader);
    assert(deleteTestimonial.statusCode === 200, 'DELETE /api/testimonials/:id deletes testimonial with HTTP 200');

    // 7.11 Verify persistence of deletion
    const adminCheckAfterDelete = await request('GET', '/testimonials?approved=all&limit=50', null, authHeader);
    const existsAfterDelete = adminCheckAfterDelete.data.data.testimonials.some(t => t._id === createdTestimonialId);
    assert(!existsAfterDelete, 'Deleted testimonial is completely removed from database');
  } catch (err) {
    assert(false, `Testimonial lifecycle failed: ${err.message}`);
  }

  // --- SECTION 8: RESULTS SUMMARY ---
  console.log('\n====================================================');
  console.log(` TOTAL TESTS: ${results.passed.length + results.failed.length}`);
  console.log(` PASSED: ${results.passed.length}`);
  console.log(` FAILED: ${results.failed.length}`);
  console.log('====================================================');
  
  if (results.failed.length > 0) {
    console.error('Failed test details:');
    results.failed.forEach(f => console.error(' - ' + f));
    process.exit(1);
  } else {
    console.log('ALL API & DATABASE INTEGRITY TESTS PASSED SUCCESSFULLY!');
  }
}

runQA();
