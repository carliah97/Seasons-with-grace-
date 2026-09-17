(function(){
  const C = window.SWG_LAUNCH_CONFIG || {};
  const digits = value => String(value || "").replace(/[^\d+]/g,"");

  document.querySelectorAll("[data-announcement]").forEach(e => e.textContent = C.announcement || "");
  document.querySelectorAll("[data-service-area]").forEach(e => e.textContent = C.serviceArea || "");

  document.querySelectorAll("[data-phone-display]").forEach(e => e.textContent = C.phone || "Phone not configured");
  document.querySelectorAll("[data-email-display]").forEach(e => e.textContent = C.email || "Email not configured");

  document.querySelectorAll("[data-phone-link]").forEach(a => {
    if(C.phone){
      a.href = "tel:" + digits(C.phone);
      a.removeAttribute("aria-disabled");
    }else{
      a.href = "#quote";
      a.setAttribute("aria-disabled","true");
    }
  });
  document.querySelectorAll("[data-sms-link]").forEach(a => {
    const n = C.smsNumber || C.phone;
    if(n){
      a.href = "sms:" + digits(n);
      a.removeAttribute("aria-disabled");
    }else{
      a.href = "#quote";
      a.setAttribute("aria-disabled","true");
    }
  });
  document.querySelectorAll("[data-email-link]").forEach(a => {
    if(C.email) a.href = "mailto:" + C.email;
    else a.href = "#quote";
  });

  // Attribution storage for ad leads.
  const params = new URLSearchParams(location.search);
  const names = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];
  const attribution = {};
  names.forEach(name => {
    const value = params.get(name);
    if(value){
      sessionStorage.setItem("swg_" + name, value);
    }
    const stored = sessionStorage.getItem("swg_" + name);
    if(stored) attribution[name] = stored;
  });
  attribution.landing_page = location.href;
  attribution.referrer = document.referrer || "";
  window.SWGAttribution = attribution;

  // Lightweight analytics consent.
  const hasTracking = !!(C.metaPixelId || C.ga4MeasurementId || C.googleAdsId);
  const consentKey = "swgAnalyticsConsent";
  let trackingLoaded = false;

  function loadGoogle(){
    if(trackingLoaded || (!C.ga4MeasurementId && !C.googleAdsId)) return;
    const id = C.ga4MeasurementId || C.googleAdsId;
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag("js", new Date());
    if(C.ga4MeasurementId) gtag("config", C.ga4MeasurementId);
    if(C.googleAdsId) gtag("config", C.googleAdsId);
  }

  function loadMeta(){
    if(!C.metaPixelId || window.fbq) return;
    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)
    }(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", C.metaPixelId);
    fbq("track","PageView");
  }

  function enableTracking(){
    if(trackingLoaded) return;
    trackingLoaded = true;
    loadGoogle();
    loadMeta();
  }

  const banner = document.getElementById("cookieBanner");
  if(hasTracking){
    const choice = localStorage.getItem(consentKey);
    if(choice === "yes") enableTracking();
    else if(!choice) banner?.classList.add("show");
  }

  document.getElementById("acceptAnalytics")?.addEventListener("click", () => {
    localStorage.setItem(consentKey,"yes");
    banner?.classList.remove("show");
    enableTracking();
  });
  document.getElementById("declineAnalytics")?.addEventListener("click", () => {
    localStorage.setItem(consentKey,"no");
    banner?.classList.remove("show");
  });

  window.SWGAnalytics = {
    event(name, params={}){
      if(localStorage.getItem(consentKey) !== "yes") return;
      if(window.gtag) gtag("event",name,params);
      if(window.fbq){
        const metaName = name === "generate_lead" ? "Lead" : name === "contact" ? "Contact" : null;
        if(metaName) fbq("track",metaName,params);
      }
    },
    lead(value){
      if(localStorage.getItem(consentKey) !== "yes") return;
      if(window.gtag){
        gtag("event","generate_lead",{currency:"USD",value:Number(value||0)});
        if(C.googleAdsId && C.googleAdsConversionLabel){
          gtag("event","conversion",{send_to:`${C.googleAdsId}/${C.googleAdsConversionLabel}`});
        }
      }
      if(window.fbq) fbq("track","Lead");
    }
  };

  document.querySelectorAll("[data-track]").forEach(el => el.addEventListener("click", () => {
    window.SWGAnalytics?.event(el.dataset.track || "click");
  }));

  document.getElementById("year")?.replaceChildren(String(new Date().getFullYear()));
})();
