export function modalFocus(node:HTMLElement,close:()=>void){
 const previous=document.activeElement as HTMLElement|null;const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
 const getButtons=()=>Array.from(node.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'));
 queueMicrotask(()=>getButtons()[0]?.focus());
 const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const items=getButtons();const first=items[0];const last=items.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};
 node.addEventListener('keydown',key);return{destroy(){node.removeEventListener('keydown',key);document.body.style.overflow=overflow;previous?.focus();}};
}
