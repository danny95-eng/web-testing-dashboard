(function(){const p=document.createElement("link").relList;if(p&&p.supports&&p.supports("modulepreload"))return;for(const c of document.querySelectorAll('link[rel="modulepreload"]'))b(c);new MutationObserver(c=>{for(const u of c)if(u.type==="childList")for(const f of u.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&b(f)}).observe(document,{childList:!0,subtree:!0});function v(c){const u={};return c.integrity&&(u.integrity=c.integrity),c.referrerPolicy&&(u.referrerPolicy=c.referrerPolicy),c.crossOrigin==="use-credentials"?u.credentials="include":c.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function b(c){if(c.ep)return;c.ep=!0;const u=v(c);fetch(c.href,u)}})();console.log("[Dashboard] Script starting");console.log("[Dashboard] main.js loaded");(function(){var B,q,L;let x=null,p=null,v=null;function b(t){document.querySelectorAll(".tab-content").forEach(s=>{s.classList.remove("active")}),document.querySelectorAll(".tab-btn").forEach(s=>{s.classList.remove("text-potent-purple","border-b-2","border-potent-purple","bg-fearless-fuchsia/10"),s.classList.add("text-gray-600")}),document.getElementById(t+"-tab").classList.add("active");const e=document.querySelector(`[data-tab="${t}"]`);e&&(e.classList.add("text-potent-purple","border-b-2","border-potent-purple","bg-fearless-fuchsia/10"),e.classList.remove("text-gray-600"))}function c(t=null){x=t;const e=document.getElementById("idea-modal"),s=document.getElementById("idea-modal-title");if(t){s.textContent="Edit Test Idea";const n=C(t);document.getElementById("idea-name").value=n.name||"",document.getElementById("idea-element").value=n.element||"",document.getElementById("idea-reasoning").value=n.reasoning||"",document.getElementById("idea-howto").value=n.howto||"",document.getElementById("idea-success").value=n.success||""}else{s.textContent="Add New Test Idea";const n=document.getElementById("idea-form");n&&n.reset()}e==null||e.classList.add("active")}function u(){var t;(t=document.getElementById("idea-modal"))==null||t.classList.remove("active"),x=null}function f(t=null){p=t;const e=document.getElementById("test-modal"),s=document.getElementById("test-modal-title");if(t){s.textContent="Edit Test";const n=D(t);document.getElementById("test-name").value=n.name||"",document.getElementById("test-start-date").value=n.startDate||"",document.getElementById("test-end-date").value=n.endDate||"",document.getElementById("test-tester").value=n.tester||"",document.getElementById("test-status").value=n.status,document.getElementById("test-notes").value=n.notes||""}else{s.textContent="Create New Test";const n=document.getElementById("test-form");n&&n.reset()}e==null||e.classList.add("active")}function w(){var t;(t=document.getElementById("test-modal"))==null||t.classList.remove("active"),p=null}function E(t){v=t;const e=document.getElementById("complete-modal"),s=D(t),n=new Date().toISOString().split("T")[0],o=document.getElementById("complete-end-date");o&&(o.value=s.endDate||n);const i=document.getElementById("complete-results");i&&(i.value=s.results||""),e==null||e.classList.add("active")}function I(){var t;(t=document.getElementById("complete-modal"))==null||t.classList.remove("active"),v=null}function C(t){var s,n,o,i,l,r,m,a,d,g;const e=t.closest(".bg-wellness-white");return{name:((n=(s=e==null?void 0:e.querySelector("h3"))==null?void 0:s.textContent)==null?void 0:n.trim())||"",element:((i=(o=e==null?void 0:e.querySelector(".grid > div:nth-child(1) p"))==null?void 0:o.textContent)==null?void 0:i.trim())||"",reasoning:((r=(l=e==null?void 0:e.querySelector(".grid > div:nth-child(2) p"))==null?void 0:l.textContent)==null?void 0:r.trim())||"",howto:((a=(m=e==null?void 0:e.querySelector(".grid > div:nth-child(3) p"))==null?void 0:m.textContent)==null?void 0:a.trim())||"",success:((g=(d=e==null?void 0:e.querySelector(".mt-2 p"))==null?void 0:d.textContent)==null?void 0:g.trim())||""}}function D(t){var s,n,o,i,l,r,m,a,d,g,y,h;const e=t.closest(".bg-white");return{name:((n=(s=e==null?void 0:e.querySelector("h3"))==null?void 0:s.textContent)==null?void 0:n.trim())||"",startDate:((i=(o=e==null?void 0:e.querySelector(".grid > div:nth-child(1) p"))==null?void 0:o.textContent)==null?void 0:i.trim())||"",endDate:((r=(l=e==null?void 0:e.querySelector(".grid > div:nth-child(2) p"))==null?void 0:l.textContent)==null?void 0:r.trim())||"",tester:((a=(m=e==null?void 0:e.querySelector(".grid > div:nth-child(3) p"))==null?void 0:m.textContent)==null?void 0:a.trim())||"",status:e!=null&&e.querySelector(".inline-block.bg-yellow-100")?"in-progress":e!=null&&e.querySelector(".inline-block.bg-green-100")?"completed":"planned",notes:((g=(d=e==null?void 0:e.querySelector(".mb-4 p"))==null?void 0:d.textContent)==null?void 0:g.trim())||"",results:((h=(y=e==null?void 0:e.querySelector(".mb-4 p"))==null?void 0:y.textContent)==null?void 0:h.trim())||""}}function S(t){const e=document.getElementById("ideas-list"),s=document.createElement("div");s.className="bg-wellness-white rounded-lg p-4 border-l-4 border-potent-purple shadow-sm",s.innerHTML=`
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-mindful-midnight">${t.name}</h3>
        <div class="flex gap-2">
          <button onclick="editIdea(this)" class="text-potent-purple hover:text-darker-violet text-sm">✏️ Edit</button>
          <button onclick="createTestFromIdea(this)" class="text-black hover:text-vitality-violet text-sm">🧪 Create Test</button>
          <button onclick="deleteIdea(this)" class="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-4 text-sm">
        <div>
          <span class="font-medium text-mindful-midnight">Element:</span>
          <p class="text-gray-700">${t.element}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Reasoning:</span>
          <p class="text-gray-700">${t.reasoning}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">How to Test:</span>
          <p class="text-gray-700">${t.howto}</p>
        </div>
      </div>
      <div class="mt-2">
        <span class="font-medium text-mindful-midnight text-sm">Success Criteria:</span>
        <p class="text-gray-700 text-sm">${t.success}</p>
      </div>`,e==null||e.prepend(s)}function $(t){c(t.closest(".bg-wellness-white"))}function k(t){var e;(e=t.closest(".bg-wellness-white"))==null||e.remove()}function F(t){const e=C(t.closest(".bg-wellness-white"));f();const s=document.getElementById("test-name"),n=document.getElementById("test-notes");s&&(s.value=e.name),n&&(n.value=`Created from idea: ${e.reasoning}`)}async function T(t){const e=document.getElementById("tests-list"),s=document.createElement("div");s.className="bg-white rounded-lg p-6 border shadow-sm border-l-4 border-vitality-violet",s.innerHTML=`
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="font-semibold text-mindful-midnight text-lg">${t.name}</h3>
          <span class="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">In Progress</span>
        </div>
        <div class="flex gap-2">
          <button onclick="editTest(this)" class="text-potent-purple hover:text-darker-violet text-sm">✏️ Edit</button>
          <button onclick="completeTest(this)" class="text-tenacious-turquoise hover:text-vitality-violet text-sm">✅ Complete</button>
          <button onclick="deleteTest(this)" class="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
        </div>
      </div>
      <div class="grid md:grid-cols-3 gap-4 mb-4">
        <div>
          <span class="font-medium text-mindful-midnight">Start Date:</span>
          <p class="text-gray-700">${t.startDate}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Expected End:</span>
          <p class="text-gray-700">${t.endDate}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Tester:</span>
          <p class="text-gray-700">${t.tester}</p>
        </div>
      </div>
      <div class="mb-4">
        <span class="font-medium text-mindful-midnight">Notes:</span>
        <p class="text-gray-700">${t.notes}</p>
      </div>
      <div class="bg-wellness-white p-3 rounded">
        <span class="font-medium text-mindful-midnight text-sm">Screenshots:</span>
        <div class="mt-2 flex gap-2">
          <div class="bg-fearless-fuchsia/20 w-20 h-16 rounded flex items-center justify-center text-xs text-mindful-midnight">📱 Mobile</div>
          <div class="bg-fearless-fuchsia/20 w-20 h-16 rounded flex items-center justify-center text-xs text-mindful-midnight">💻 Desktop</div>
        </div>
      </div>`,e==null||e.prepend(s)}function j(t){f(t.closest(".bg-white"))}function M(t){var e;(e=t.closest(".bg-white"))==null||e.remove()}function A(t){E(t.closest(".bg-white"))}function O(t){var s;const e=t.closest(".bg-white");alert("Displaying test results for: "+(((s=e==null?void 0:e.querySelector("h3"))==null?void 0:s.textContent)||""))}function H(t){const e={element:"",reasoning:"",howto:"",success:""};if(!t)return e;const s=String(t).split(/\r?\n/);for(const n of s){const[o,...i]=n.split(":");if(!o||i.length===0)continue;const l=o.trim().toLowerCase(),r=i.join(":").trim();l.startsWith("element")?e.element=r:l.startsWith("reasoning")?e.reasoning=r:l.startsWith("how to test")?e.howto=r:l.startsWith("success criteria")&&(e.success=r)}return e}async function P(){const t=document.getElementById("ideas-list");t&&(t.innerHTML='<div class="text-gray-500">Loading ideas…</div>');try{console.log("[Dashboard] Fetching /api/ideas");const e=await fetch("/api/ideas",{cache:"no-store",headers:{Accept:"application/json"}});if(!e.ok)throw new Error("Failed to fetch ideas");const s=await e.json();if(console.log("[Dashboard] Ideas response",s),!Array.isArray(s)||s.length===0){if(t){const n=document.createElement("div");n.className="text-gray-500",n.textContent="No ideas yet. Add your first idea!",t.appendChild(n)}return}t&&(t.innerHTML="");for(const n of s){const o=H(n.description),i={name:n.title||"Untitled",element:o.element,reasoning:o.reasoning,howto:o.howto,success:o.success};S(i)}}catch(e){if(console.error("Failed loading ideas:",e),t){const s=document.createElement("div");s.className="text-red-600",s.textContent="Failed to load ideas from the server.",t.appendChild(s)}}}async function R(){const t=document.getElementById("tests-list");t&&(t.innerHTML='<div class="text-gray-500">Loading active tests…</div>');try{console.log("[Dashboard] Fetching /api/tests");const e=await fetch("/api/tests",{cache:"no-store",headers:{Accept:"application/json"}});if(!e.ok)throw new Error("Failed to fetch active tests");const s=await e.json();if(console.log("[Dashboard] Active tests response",s),!Array.isArray(s)||s.length===0){if(t){const n=document.createElement("div");n.className="text-gray-500",n.textContent="No active tests.",t.appendChild(n)}return}t&&(t.innerHTML="");for(const n of s){const o={name:n.Name||"Untitled Test",startDate:n["Start Date"]||"",endDate:n["Expected End Date"]||"",tester:n.Tester||"",notes:n.Notes||""};T(o)}}catch(e){if(console.error("Failed loading active tests:",e),t){const s=document.createElement("div");s.className="text-red-600",s.textContent="Failed to load active tests from the server.",t.appendChild(s)}}}function W(t){const e=document.getElementById("completed-list"),s=document.createElement("div");s.className="bg-white rounded-lg p-6 border shadow-sm border-l-4 border-green-500",s.innerHTML=`
      <div class="flex justify-between items-start mb-4">
        <div>
          <h3 class="font-semibold text-mindful-midnight text-lg">${t.name}</h3>
          <div class="flex gap-2 mt-1">
            <span class="inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">${t.result||"Completed"}</span>
            <span class="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">Completed</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button onclick="viewTestResults(this)" class="text-potent-purple hover:text-darker-violet text-sm">📊 View Results</button>
          <button onclick="deleteTest(this)" class="text-red-600 hover:text-red-800 text-sm">🗑️ Delete</button>
        </div>
      </div>
      <div class="grid md:grid-cols-4 gap-4 mb-4">
        <div>
          <span class="font-medium text-mindful-midnight">Start Date:</span>
          <p class="text-gray-700">${t.startDate||""}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">End Date:</span>
          <p class="text-gray-700">${t.endDate||""}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Duration:</span>
          <p class="text-gray-700">${t.duration||""}</p>
        </div>
        <div>
          <span class="font-medium text-mindful-midnight">Tester:</span>
          <p class="text-gray-700">${t.tester||""}</p>
        </div>
      </div>
      <div class="mb-4">
        <span class="font-medium text-mindful-midnight">Test Results:</span>
        <p class="text-gray-700">${t.results||""}</p>
      </div>`,e==null||e.appendChild(s)}async function J(){const t=document.getElementById("completed-list");t&&(t.innerHTML='<div class="text-gray-500">Loading completed tests…</div>');try{console.log("[Dashboard] Fetching /api/tests?status=completed");const e=await fetch("/api/tests?status=completed",{cache:"no-store",headers:{Accept:"application/json"}});if(!e.ok)throw new Error("Failed to fetch completed tests");const s=await e.json();if(console.log("[Dashboard] Completed tests response",s),!Array.isArray(s)||s.length===0){if(t){const n=document.createElement("div");n.className="text-gray-500",n.textContent="No completed tests.",t.appendChild(n)}return}t&&(t.innerHTML="");for(const n of s){const o={name:n.Name||"Untitled Test",startDate:n["Start Date"]||"",endDate:n["End Date"]||"",tester:n.Tester||"",result:n.Result||"Completed",results:n.Results||""};W(o)}}catch(e){if(console.error("Failed loading completed tests:",e),t){const s=document.createElement("div");s.className="text-red-600",s.textContent="Failed to load completed tests from the server.",t.appendChild(s)}}}(B=document.getElementById("idea-form"))==null||B.addEventListener("submit",async t=>{var n,o,i,l,r,m;t.preventDefault();const e={name:(n=document.getElementById("idea-name"))==null?void 0:n.value.trim(),submitter:(o=document.getElementById("idea-submitter"))==null?void 0:o.value.trim(),element:(i=document.getElementById("idea-element"))==null?void 0:i.value.trim(),reasoning:(l=document.getElementById("idea-reasoning"))==null?void 0:l.value.trim(),howto:(r=document.getElementById("idea-howto"))==null?void 0:r.value.trim(),success:(m=document.getElementById("idea-success"))==null?void 0:m.value.trim()},s=[e.element&&`Element: ${e.element}`,e.reasoning&&`Reasoning: ${e.reasoning}`,e.howto&&`How to Test: ${e.howto}`,e.success&&`Success Criteria: ${e.success}`].filter(Boolean).join(`
`);try{const a=await fetch("/api/ideas",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:e.name,description:s,submittedBy:e.submitter||void 0})});if(!a.ok){const d=await a.json().catch(()=>({}));throw new Error(d.error||"Failed to save idea")}if(x){const d=x.closest(".bg-wellness-white");d.querySelector("h3").textContent=e.name,d.querySelector(".grid > div:nth-child(1) p").textContent=e.element,d.querySelector(".grid > div:nth-child(2) p").textContent=e.reasoning,d.querySelector(".grid > div:nth-child(3) p").textContent=e.howto,d.querySelector(".mt-2 p").textContent=e.success}else S(e);u()}catch(a){console.error("Save idea failed:",a),alert("Failed to save idea to Google Sheet. Please try again.")}}),(q=document.getElementById("test-form"))==null||q.addEventListener("submit",async t=>{var s,n,o,i,l,r;t.preventDefault();const e={name:(s=document.getElementById("test-name"))==null?void 0:s.value,startDate:(n=document.getElementById("test-start-date"))==null?void 0:n.value,endDate:(o=document.getElementById("test-end-date"))==null?void 0:o.value,tester:(i=document.getElementById("test-tester"))==null?void 0:i.value,status:(l=document.getElementById("test-status"))==null?void 0:l.value,notes:(r=document.getElementById("test-notes"))==null?void 0:r.value};try{const m=await fetch("/api/tests",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e.name,startDate:e.startDate,expectedEndDate:e.endDate,tester:e.tester,status:e.status,notes:e.notes})});if(!m.ok){const a=await m.json().catch(()=>({}));throw new Error(a.error||"Failed to save test")}if(p){const a=p.closest(".bg-white");a.querySelector("h3").textContent=e.name,a.querySelector(".grid > div:nth-child(1) p").textContent=e.startDate,a.querySelector(".grid > div:nth-child(2) p").textContent=e.endDate,a.querySelector(".grid > div:nth-child(3) p").textContent=e.tester,a.querySelector(".mb-4 p").textContent=e.notes}else T(e);w()}catch(m){console.error("Save test failed:",m),alert("Failed to save test to Google Sheet.")}}),(L=document.getElementById("complete-form"))==null||L.addEventListener("submit",async t=>{var o,i,l,r,m,a;t.preventDefault();const e=(o=document.getElementById("complete-result"))==null?void 0:o.value,s=(i=document.getElementById("complete-end-date"))==null?void 0:i.value,n=(l=document.getElementById("complete-results"))==null?void 0:l.value;if(v){const d=v.closest(".bg-white"),g=d.querySelector(".inline-block.bg-yellow-100");g&&g.remove();const y=document.createElement("span");y.className=e==="passed"?"inline-block bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium":"inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium",y.textContent=e==="passed"?"✅ Passed":"❌ Failed",d.querySelector(".flex.gap-2").before(y),d.querySelector(".grid > div:nth-child(2) p").textContent=s;const h=document.createElement("div");h.className="mb-4",h.innerHTML=`
        <span class="font-medium text-mindful-midnight">Test Results:</span>
        <p class="text-gray-700">${n}</p>`;const N=d.querySelector(".mb-4:last-child");N?N.replaceWith(h):d.appendChild(h);try{await fetch("/api/complete-test",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:(r=d.querySelector("h3"))==null?void 0:r.textContent,startDate:(m=d.querySelector(".grid > div:nth-child(1) p"))==null?void 0:m.textContent,endDate:s,tester:(a=d.querySelector(".grid > div:nth-child(3) p"))==null?void 0:a.textContent,result:e==="passed"?"Passed":"Failed",results:n})})}catch(U){console.error("Record completion failed:",U)}}I()}),P(),R(),J(),Object.assign(window,{switchTab:b,openIdeaModal:c,closeIdeaModal:u,openTestModal:f,closeTestModal:w,openCompleteModal:E,closeCompleteModal:I,editIdea:$,deleteIdea:k,createTestFromIdea:F,editTest:j,deleteTest:M,completeTest:A,viewTestResults:O})})();
