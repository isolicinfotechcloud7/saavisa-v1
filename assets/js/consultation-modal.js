(function () {
  'use strict';

  var VERSION = '20260925-cta-modal-v1';

  function daysOptions() {
    var out = '<option value="" disabled selected>Day</option>';
    for (var i = 1; i <= 31; i++) out += '<option value="' + i + '">' + i + '</option>';
    return out;
  }

  function yearsOptions() {
    var out = '<option value="" disabled selected>Year</option>';
    var now = new Date().getFullYear();
    for (var y = now - 16; y >= 1970; y--) out += '<option value="' + y + '">' + y + '</option>';
    return out;
  }

  function formHTML() {
    return '' +
      '<div class="saa-modal-header">' +
        '<h2 class="saa-modal-title" id="saaModalTitle">Book Your Free Consultation</h2>' +
        '<p class="saa-modal-subtitle">Get expert guidance on your study abroad journey — completely free</p>' +
      '</div>' +
      '<form class="saa-modal-form" id="saaModalForm" novalidate>' +
        '<div class="saa-modal-group">' +
          '<label class="saa-modal-label" for="saaName">Full Name <span class="saa-modal-req">*</span></label>' +
          '<input class="saa-modal-input" type="text" id="saaName" name="name" placeholder="Enter your full name" required>' +
        '</div>' +
        '<div class="saa-modal-group">' +
          '<label class="saa-modal-label" for="saaPhone">Phone Number <span class="saa-modal-req">*</span></label>' +
          '<input class="saa-modal-input" type="tel" id="saaPhone" name="phone" placeholder="+880 1XXX-XXXXXX" required minlength="10">' +
        '</div>' +
        '<div class="saa-modal-group">' +
          '<label class="saa-modal-label">Date of Birth <span class="saa-modal-req">*</span></label>' +
          '<div class="saa-modal-dob-row">' +
            '<select class="saa-modal-input saa-modal-dob-day" id="saaDobDay" name="dob_day" required>' + daysOptions() + '</select>' +
            '<select class="saa-modal-input saa-modal-dob-month" id="saaDobMonth" name="dob_month" required>' +
              '<option value="" disabled selected>Month</option>' +
              '<option value="January">January</option><option value="February">February</option><option value="March">March</option>' +
              '<option value="April">April</option><option value="May">May</option><option value="June">June</option>' +
              '<option value="July">July</option><option value="August">August</option><option value="September">September</option>' +
              '<option value="October">October</option><option value="November">November</option><option value="December">December</option>' +
            '</select>' +
            '<select class="saa-modal-input saa-modal-dob-year" id="saaDobYear" name="dob_year" required>' + yearsOptions() + '</select>' +
          '</div>' +
        '</div>' +
        '<div class="saa-modal-group">' +
          '<label class="saa-modal-label" for="saaEducation">Current Education Level <span class="saa-modal-req">*</span></label>' +
          '<select class="saa-modal-input" id="saaEducation" name="education" required>' +
            '<option value="" disabled selected>Select your education level</option>' +
            '<option value="SSC / O Level">SSC / O Level</option><option value="HSC / A Level">HSC / A Level</option>' +
            '<option value="Bachelor\'s (Running)">Bachelor\'s (Running)</option><option value="Bachelor\'s (Completed)">Bachelor\'s (Completed)</option>' +
            '<option value="Master\'s (Running)">Master\'s (Running)</option><option value="Master\'s (Completed)">Master\'s (Completed)</option>' +
            '<option value="Other">Other</option>' +
          '</select>' +
        '</div>' +
        '<div class="saa-modal-group">' +
          '<label class="saa-modal-label">Do you have an English proficiency test result? <span class="saa-modal-req">*</span></label>' +
          '<div class="saa-modal-radio-group">' +
            '<label class="saa-modal-radio-label"><input type="radio" name="hasTest" value="yes" class="saa-modal-radio" id="saaTestYes"> Yes</label>' +
            '<label class="saa-modal-radio-label"><input type="radio" name="hasTest" value="no" class="saa-modal-radio" id="saaTestNo"> No</label>' +
          '</div>' +
        '</div>' +
        '<div class="saa-modal-group saa-modal-conditional" id="saaTestTypeWrap" style="display:none">' +
          '<label class="saa-modal-label" for="saaTestType">Which test did you take? <span class="saa-modal-req">*</span></label>' +
          '<select class="saa-modal-input" id="saaTestType" name="test_type">' +
            '<option value="" disabled selected>Select your test</option>' +
            '<option value="IELTS">IELTS</option><option value="TOEFL">TOEFL</option><option value="PTE">PTE</option>' +
            '<option value="Duolingo">Duolingo</option><option value="MOI Certificate">MOI Certificate</option>' +
          '</select>' +
        '</div>' +
        '<div class="saa-modal-group">' +
          '<label class="saa-modal-label" for="saaCountry">Desired Country for Study <span class="saa-modal-req">*</span></label>' +
          '<select class="saa-modal-input" id="saaCountry" name="country" required>' +
            '<option value="" disabled selected>Select your destination</option>' +
            '<option value="Canada">Canada</option><option value="USA">USA</option><option value="UK">UK</option>' +
            '<option value="Europe">Europe</option><option value="Australia">Australia</option><option value="Not Sure Yet">Not Sure Yet</option>' +
          '</select>' +
        '</div>' +
        '<button class="saa-modal-submit" type="submit" id="saaModalSubmit">Submit &amp; Get Free Consultation</button>' +
        '<p class="saa-modal-note">&#128274; Your information is 100% confidential</p>' +
      '</form>';
  }

  function ensureModal() {
    var existing = document.getElementById('saaModalOverlay');
    if (existing) return existing;

    var overlay = document.createElement('div');
    overlay.className = 'saa-modal-overlay';
    overlay.id = 'saaModalOverlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'saaModalTitle');
    overlay.innerHTML = '' +
      '<div class="saa-modal-card">' +
        '<button class="saa-modal-close" id="saaModalClose" type="button" aria-label="Close modal">&times;</button>' +
        '<div id="saaModalContent">' + formHTML() + '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  var overlay;

  function openModal(event) {
    if (event) event.preventDefault();
    overlay = ensureModal();
    overlay.style.display = 'flex';
    requestAnimationFrame(function () { overlay.classList.add('saa-modal-active'); });
    document.body.style.overflow = 'hidden';
    var first = overlay.querySelector('input, select, textarea, button');
    if (first) setTimeout(function () { first.focus(); }, 80);
  }

  function closeModal() {
    if (!overlay) overlay = document.getElementById('saaModalOverlay');
    if (!overlay) return;
    overlay.classList.remove('saa-modal-active');
    document.body.style.overflow = '';
    setTimeout(function () { overlay.style.display = ''; }, 250);
  }

  function isConsultationTrigger(el) {
    if (!el) return false;
    if (el.matches('[data-consultation-modal], .saa-consultation-trigger')) return true;
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim().toLowerCase();
    var href = (el.getAttribute('href') || '').trim().toLowerCase();
    return text.indexOf('book free consultation') !== -1 ||
           text.indexOf('book consultation') !== -1 ||
           href === '/contact/#book' || href === 'https://saavisa.com/contact/#book';
  }

  function attachInjectedFormBehavior(root) {
    var form = root.querySelector('#saaModalForm');
    if (!form || form.dataset.sharedModalBound === VERSION) return;
    form.dataset.sharedModalBound = VERSION;

    var yes = root.querySelector('#saaTestYes');
    var no = root.querySelector('#saaTestNo');
    var testWrap = root.querySelector('#saaTestTypeWrap');
    var testType = root.querySelector('#saaTestType');

    function syncTest() {
      var show = !!(yes && yes.checked);
      if (testWrap) testWrap.style.display = show ? 'block' : 'none';
      if (testType) testType.required = show;
      if (!show && testType) testType.value = '';
    }
    if (yes) yes.addEventListener('change', syncTest);
    if (no) no.addEventListener('change', syncTest);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var selected = form.querySelector('input[name="hasTest"]:checked');
      if (!selected) {
        alert('Please select whether you have an English proficiency test result.');
        return;
      }
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      var content = root.querySelector('#saaModalContent');
      if (!content) return;
      content.innerHTML = '' +
        '<div class="saa-modal-success">' +
          '<div class="saa-modal-check">&#10003;</div>' +
          '<h2 class="saa-modal-title">Thank You!</h2>' +
          '<p class="saa-modal-subtitle">We\'ve received your details. Our expert team will contact you within 24 hours via WhatsApp or phone.</p>' +
          '<button class="saa-modal-submit saa-modal-close-success" type="button">Close</button>' +
        '</div>';
    });
  }

  document.addEventListener('click', function (e) {
    var clickable = e.target.closest('a, button');
    if (isConsultationTrigger(clickable)) {
      openModal(e);
      attachInjectedFormBehavior(overlay);
      return;
    }

    if (e.target.closest('#saaModalClose, .saa-modal-close-success')) {
      closeModal();
      return;
    }

    if (e.target.id === 'saaModalOverlay') closeModal();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  document.addEventListener('DOMContentLoaded', function () {
    overlay = ensureModal();
    attachInjectedFormBehavior(overlay);
  });
})();
