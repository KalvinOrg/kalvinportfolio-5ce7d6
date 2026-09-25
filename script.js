(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduceMotion){ document.body.classList.add('no-anim'); }

  /* ---- Navbar scrolled state ---- */
  var navbar = document.getElementById('navbar');
  function onScroll(){
    if(window.scrollY > 12){ navbar.classList.add('is-scrolled'); }
    else{ navbar.classList.remove('is-scrolled'); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.getElementById('navToggle');
  var mobilePanel = document.getElementById('mobilePanel');
  navToggle.addEventListener('click', function(){
    var isOpen = mobilePanel.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  mobilePanel.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', function(){
      mobilePanel.classList.remove('is-open');
      navToggle.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Featured Projects ----
     Add a new project by adding an object to this array — that's the
     only edit needed. Leave demo/github as '' until you have a real
     URL; that button is hidden automatically rather than showing a
     dead or fake link. Never put a placeholder URL in demo/github —
     use '' so the button stays hidden until the real one is ready.

     role: whose work this is. Use "Karl — Frontend", "Alvin — Backend",
     or "Karl + Alvin — Full Build" to match the site's existing role
     labels and color-coding (also controls the Frontend/Backend/Full
     Build tag shown on the card). */
  var projects = [
    {
      title: 'Construction Firm Website',
      description: "A responsive construction company website showcasing surveying, civil engineering, architecture, construction services, projects, and contact information.",
      image: 'Photos/Kalasag.png',
      tools: ['[HTML', 'JavaScript', 'CSS', 'EmailJS]'],
      role: 'Karl — Frontend',
      demo: 'https://contruction-project-339022.netlify.app/',
      github: ''
    },
    {
      title: '[PROJECT NAME]',
      description: "[PROJECT DESCRIPTION] — the service, the data model, and what it's built to handle.",
      image: '',
      tools: ['[TECH 1]', '[TECH 2]', '[TECH 3]'],
      role: 'Alvin — Backend',
      demo: '',
      github: ''
    },
    {
      title: '[PROJECT NAME]',
      description: '[PROJECT DESCRIPTION] — the product end to end, from interface to database.',
      image: '',
      tools: ['[TECH 1]', '[TECH 2]', '[TECH 3]', '[TECH 4]'],
      role: 'Karl + Alvin — Full Build',
      demo: '',
      github: ''
    }
  ];

  function escapeHTML(value){
    var div = document.createElement('div');
    div.textContent = value == null ? '' : String(value);
    return div.innerHTML;
  }

  // Derives the existing Frontend/Backend/Full Build tag + color from
  // the role text, so the array only needs one field per project.
  function projectType(role){
    var text = String(role || '');
    var hasKarl = /karl/i.test(text);
    var hasAlvin = /alvin/i.test(text);
    if(hasKarl && hasAlvin){ return { cls:'both', label:'Full Build' }; }
    if(hasAlvin){ return { cls:'a', label:'Backend' }; }
    return { cls:'k', label:'Frontend' };
  }

  function renderProjects(){
    var grid = document.getElementById('projectsGrid');
    if(!grid){ return; }

    grid.innerHTML = projects.map(function(p){
      var type = projectType(p.role);

      var thumb = p.image
        ? '<img src="' + escapeHTML(p.image) + '" alt="' + escapeHTML(p.title) + '">'
        : '<span>[PROJECT IMAGE]</span>';

      var tools = (p.tools || []).map(function(t){
        return '<span class="project-tech-tag">' + escapeHTML(t) + '</span>';
      }).join('');

      var links = '';
      if(p.demo){
        links += '<a class="btn btn-ghost" href="' + escapeHTML(p.demo) + '" target="_blank" rel="noopener noreferrer">Live Demo</a>';
      }
      if(p.github){
        links += '<a class="btn btn-ghost" href="' + escapeHTML(p.github) + '" target="_blank" rel="noopener noreferrer">GitHub</a>';
      }

      return (
        '<div class="project-card reveal">' +
          '<div class="project-thumb">' + thumb + '</div>' +
          '<div class="project-body">' +
            '<span class="project-tag ' + type.cls + '">' + type.label + '</span>' +
            '<h3>' + escapeHTML(p.title) + '</h3>' +
            '<p class="project-desc">' + escapeHTML(p.description) + '</p>' +
            '<div class="project-meta">' +
              '<p class="project-meta-row role-' + type.cls + '"><span class="project-meta-label">' + escapeHTML(p.role) + '</span></p>' +
            '</div>' +
            '<div class="project-tech">' + tools + '</div>' +
            (links ? '<div class="project-links">' + links + '</div>' : '') +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  renderProjects();

  /* ---- Scroll reveal ---- */
  if(!reduceMotion && 'IntersectionObserver' in window){
    var revealEls = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold:0.15, rootMargin:'0px 0px -40px 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    var answer = item.querySelector('.faq-a');
    btn.addEventListener('click', function(){
      var isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item').forEach(function(other){
        other.classList.remove('is-open');
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded','true');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---- Contact form ----
     Connected to the Karl + Alvin backend API (see /backend).
     The backend is still in dev mode — no email provider is configured
     yet, so a successful response means the message was received and
     logged server-side, not that an email went out. We only ever show
     what the API actually says. ---- */

  // Single place to change when the site goes live — swap this for the
  // deployed API URL (e.g. https://api.karlandalvin.dev) at that point.
  var API_BASE_URL = 'http://localhost:4000';

  var form = document.getElementById('contactForm');
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('contactSubmit');
  var submitBtnDefaultText = submitBtn.textContent;
  var isSubmitting = false;

  function setStatus(message, state){
    status.textContent = message;
    status.classList.remove('is-success', 'is-error');
    if(state){ status.classList.add(state); }
    status.classList.add('is-visible');
  }

  function setSubmitting(submitting){
    isSubmitting = submitting;
    submitBtn.disabled = submitting;
    submitBtn.textContent = submitting ? 'Sending…' : submitBtnDefaultText;
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();

    // Ignore repeat submits (double-click, Enter-mashing) while a
    // request is already in flight.
    if(isSubmitting){ return; }

    // Native constraint validation (required fields, email format, etc).
    // Shows the browser's built-in field-level validation UI.
    if(!form.checkValidity()){
      form.reportValidity();
      setStatus('Please fill in all required fields before sending.', 'is-error');
      return;
    }

    var payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      projectType: form.projectType.value,
      message: form.message.value.trim()
    };

    setSubmitting(true);

    fetch(API_BASE_URL + '/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function(res){
        return res.json()
          .catch(function(){
            // Response wasn't valid JSON (e.g. the API is down behind a
            // proxy that returned an HTML error page).
            return null;
          })
          .then(function(data){ return { ok: res.ok, data: data }; });
      })
      .then(function(result){
        var data = result.data;

        if(!result.ok){
          var errorMessage =
            (data && data.errors && data.errors[0] && data.errors[0].message) ||
            (data && data.message) ||
            'Something went wrong sending that. Please try again or email us directly.';
          setStatus(errorMessage, 'is-error');
          return;
        }

        // Success — only reached once the API has confirmed it.
        var successMessage =
          (data && data.message) ||
          'Thanks — your message was received.';
        setStatus(successMessage, 'is-success');
        form.reset();
      })
      .catch(function(){
        // Network failure, CORS block, or the API is simply unreachable.
        setStatus('We couldn\'t reach the server. Check your connection and try again, or email us directly at einjhelaquino02@gmail.com.', 'is-error');
      })
      .finally(function(){
        setSubmitting(false);
      });
  });
})();
