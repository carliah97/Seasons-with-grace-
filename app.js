const C = window.SWG_LAUNCH_CONFIG || {};
const menuBtn = document.getElementById("menuBtn");
const mainNav = document.getElementById("mainNav");

menuBtn?.addEventListener("click",()=>{
  const open = mainNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",String(open));
});
mainNav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  mainNav.classList.remove("open");
  menuBtn.setAttribute("aria-expanded","false");
}));

function makeLeadId(){
  return "SWG-" + Date.now().toString(36).toUpperCase();
}

async function submitLead(payload){
  if(!C.leadEndpoint){
    throw new Error("The online quote form is not connected yet. Add your leadEndpoint in launch-config.js before running ads.");
  }
  const response = await fetch(C.leadEndpoint,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body:JSON.stringify(payload)
  });
  if(!response.ok){
    let message = "The quote request could not be sent.";
    try{
      const body = await response.json();
      if(body?.errors?.[0]?.message) message = body.errors[0].message;
    }catch(e){}
    throw new Error(message);
  }
  return response;
}

const leadForm = document.getElementById("leadForm");
leadForm?.addEventListener("submit",async e=>{
  e.preventDefault();

  const status = document.getElementById("leadStatus");
  const button = document.getElementById("leadSubmit");
  const data = Object.fromEntries(new FormData(leadForm).entries());

  data.leadId = makeLeadId();
  data.source = "SWG Website Quote";
  data.submittedAt = new Date().toISOString();
  data.pageUrl = location.href;
  Object.assign(data, window.SWGAttribution || {});

  status.className = "launch-form-status show";
  status.textContent = "Sending your quote request…";
  button.disabled = true;

  try{
    await submitLead(data);

    sessionStorage.setItem("swgLastLeadId",data.leadId);
    window.SWGAnalytics?.lead();

    status.className = "launch-form-status show ok";
    status.textContent = C.responseMessage || "Your quote request was received.";

    setTimeout(()=>{
      const qs = new URLSearchParams({
        lead:data.leadId,
        pet:data.petName || ""
      });
      location.href = "thank-you.html?" + qs.toString();
    },650);
  }catch(err){
    status.className = "launch-form-status show err";
    status.textContent = err.message + (C.phone ? " You can also call or text us." : "");
    button.disabled = false;
  }
});
