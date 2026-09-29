const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=u=>{try{const x=new URL(u);return x.protocol==='https:'?esc(x.href):'#'}catch{return '#'}};
fetch('./brief.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{
 document.getElementById('date').textContent=d.updatedDate.replaceAll('-',' / ');
 document.getElementById('schedule').textContent=d.scheduleLabel;
 if(d.paperNote) document.querySelector('.section-note').textContent=d.paperNote;
 document.getElementById('counts').textContent=`${d.news.length} 条资讯 · ${d.papers.length} 篇论文`;
 if(Date.now()-new Date(d.updatedDate+'T00:00:00+08:00').getTime()>48*3600000){const s=document.getElementById('stale');s.hidden=false;s.textContent='当前显示上次成功更新的内容，最新一期尚未发布。';}
 document.getElementById('news-list').innerHTML=d.news.map(n=>`<article><div class="meta"><span class="tag">${esc(n.tag)}</span><span>${esc(n.source)} · ${esc(n.date)}</span></div><h3><a href="${safe(n.url)}" target="_blank" rel="noopener">${esc(n.title)}</a></h3><p>${esc(n.summary)}</p><a href="${safe(n.url)}" target="_blank" rel="noopener">阅读报道 ↗</a></article>`).join('')||'<p>本期暂无经核实的重要新资讯。</p>';
 document.getElementById('paper-list').innerHTML=d.papers.map((p,i)=>`<article class="paper"><span class="num">${String(i+1).padStart(2,'0')}</span><div><div class="meta"><span class="tag">${esc(p.tag)}</span><span>${esc(p.status)} · ${esc(p.date)}</span></div><h3>${esc(p.title)}</h3><div class="english">${esc(p.english)}</div><div class="meta">${esc(p.authors)}</div><p>${esc(p.summary)}</p><div class="takeaway">${esc(p.takeaway)}</div></div><div class="links"><a href="${safe(p.url)}" target="_blank" rel="noopener">原文 ↗</a><a href="${safe(p.pdf)}" target="_blank" rel="noopener">PDF ↗</a></div></article>`).join('')||'<p>本期暂无新增论文。</p>';
}).catch(()=>{document.getElementById('news-list').innerHTML='<p role="alert">暂时无法载入晨读，请刷新页面重试。</p>';document.getElementById('schedule').textContent='内容加载失败';});
