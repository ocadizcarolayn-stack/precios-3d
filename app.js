const $=id=>document.getElementById(id);
const ids=['material','bobina','inversion','meses','mensuales','tarifa','kw','luz','mantenimiento','fallos','margen','comision','cuota','envio'];
const inicial={material:'PLA',bobina:350,inversion:27998,meses:36,mensuales:150,tarifa:75,kw:.25,luz:1.5,mantenimiento:2,fallos:8,margen:35,comision:12,cuota:0,envio:0};
const pesos=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number.isFinite(n)?n:0);
function guardar(){let s={};ids.forEach(id=>s[id]=$(id).value);localStorage.setItem('p3d_settings',JSON.stringify(s));$('estado').textContent='Parámetros guardados en este dispositivo.'}
function restaurar(){Object.entries(inicial).forEach(([k,v])=>$(k).value=v);guardar();calcular()}
function calcular(){
 let g=Math.max(0,+$('gramos').value||0),b=Math.max(0,+$('bobina').value||0),h=Math.max(0,+$('horas').value||0),m=Math.max(0,+$('minutos').value||0);
 let q=Math.max(1,Math.floor(+$('cantidad').value||1)),d=Math.max(0,+$('diseno').value||0);
 let inv=Math.max(0,+$('inversion').value||0),mes=Math.max(1,+$('meses').value||1),hm=Math.max(1,+$('mensuales').value||1);
 let labor=m/60*(+$('tarifa').value||0),mat=g*b/1000,depre=inv/(mes*hm)*h,luz=(+$('kw').value||0)*h*(+$('luz').value||0),mant=h*(+$('mantenimiento').value||0);
 let falla=Math.min(100,Math.max(0,+$('fallos').value||0))/100,mar=Math.min(90,Math.max(0,+$('margen').value||0))/100,fee=Math.min(100,Math.max(0,+$('comision').value||0))/100;
 let costo=(mat+depre+luz+mant+labor+d)*(1+falla),direct=mar<1?costo/(1-mar):0;
 let plat=(1-fee-mar)>0?(costo+(+$('cuota').value||0)+(+$('envio').value||0))/(1-fee-mar):0;
 let r={nombre:$('nombre').value.trim()||'Figura sin nombre',material:$('material').value,g:g,h:h,q:q,costo,direct,plat,ganancia:direct-costo,fecha:new Date().toLocaleString('es-MX')};
 $('costo').textContent=pesos(costo);$('directo').textContent=pesos(direct);$('plataforma').textContent=plat?pesos(plat):'Revisa comisión y margen';$('ganancia').textContent=pesos(direct-costo);$('total').textContent=pesos(direct*q);
 $('detalle').textContent=`Material ${pesos(mat)} · Depreciación ${pesos(depre)} · Electricidad ${pesos(luz)} · Mantenimiento ${pesos(mant)} · Mano de obra ${pesos(labor)} · Reserva de fallos ${(falla*100).toFixed(0)}%.`;
 return r;
}
function texto(r){return `COTIZACIÓN PRECIOS 3D\nProducto: ${r.nombre}\nMaterial: ${r.material}\nFilamento: ${r.g} g por pieza\nTiempo: ${r.h} horas por pieza\nCantidad: ${r.q}\nCosto estimado por pieza: ${pesos(r.costo)}\nPrecio venta directa: ${pesos(r.direct)} por pieza\nTotal venta directa: ${pesos(r.direct*r.q)}\nPrecio sugerido en plataforma: ${pesos(r.plat)} por pieza\nGanancia directa estimada por pieza: ${pesos(r.ganancia)}\n\nPrecio sujeto a confirmación de detalles y entrega.`}
function guardarCotizacion(){let r=calcular(),a=JSON.parse(localStorage.getItem('p3d_history')||'[]');a.push(r);localStorage.setItem('p3d_history',JSON.stringify(a));verHistorial();$('estado').textContent='Cotización guardada.'}
function verHistorial(){let a=JSON.parse(localStorage.getItem('p3d_history')||'[]'),el=$('historial');el.innerHTML='';if(!a.length){el.textContent='Todavía no hay cotizaciones guardadas.';return}a.slice().reverse().forEach((r,i)=>{let d=document.createElement('div');d.className='item';let s=document.createElement('strong');s.textContent=r.nombre;let p=document.createElement('p');p.textContent=`${r.fecha} · ${r.q} pieza(s) · ${pesos(r.direct)} por pieza`;let b=document.createElement('button');b.textContent='Compartir';b.onclick=()=>wa(texto(r));d.append(s,p,b);el.append(d)})}
function wa(t){location.href='https://wa.me/?text='+encodeURIComponent(t)}
function compartir(){wa(texto(calcular()))}
async function copiar(){try{await navigator.clipboard.writeText(texto(calcular()));$('estado').textContent='Cotización copiada.'}catch{$('estado').textContent=texto(calcular())}}
function borrarHistorial(){if(confirm('¿Borrar todo el historial?')){localStorage.removeItem('p3d_history');verHistorial()}}
ids.concat(['gramos','horas','minutos','cantidad','diseno','nombre']).forEach(id=>$(id).addEventListener('input',calcular));
try{let s=JSON.parse(localStorage.getItem('p3d_settings')||'{}');Object.entries(s).forEach(([k,v])=>{if($(k))$(k).value=v})}catch{}
calcular();verHistorial();
