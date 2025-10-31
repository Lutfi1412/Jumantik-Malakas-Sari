const delay = (ms)=>new Promise(r=>setTimeout(r,ms));

export const api = {
  // mock login: always success after 400ms
  login: async (_email,_password)=> { await delay(400); return { ok:true }; },
  me: async ()=> ({ id:1, name:'Nazrul Islam' }),
  logout: async ()=> {},
  posts: async ()=> ([
    { id:1, snippet:'Demam Berdarah Dengue (DBD) adalah penyakit...', image:'', likes:1200 },
  ]),
  createReport: async (_form)=> { await delay(500); return { id: Date.now() } },

  // SSE url (ganti saat ada backend)
  chatStreamUrl: (sessionId)=> `/api/chat/stream?sessionId=${sessionId}`,
};
