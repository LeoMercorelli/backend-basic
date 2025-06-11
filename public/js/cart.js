// Utilidad para mostrar mensajes tipo "toast"
const toastEl = document.getElementById('toast') || (() => {
  const t = document.createElement('div');
  t.id = 'toast';
  t.className = 'toast';
  document.body.appendChild(t);
  return t;
})();

function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  setTimeout(() => toastEl.classList.remove('show'), 2000);
}

// Cuando inicia la página actualizo el enlace "Ver carrito" si existe
document.addEventListener('DOMContentLoaded', async () => {
  const link = document.getElementById('viewCart');
  if (link) {
    const cid = await getCartId();
    if (cid) link.href = `/carts/${cid}`;
  }
});

// Esta función crea un carrito si no hay uno guardado o si el actual no existe
async function getCartId() {
  let cid = localStorage.getItem('cartId');

  if (cid) {
    const check = await fetch(`/api/carts/${cid}`);
    if (check.ok) return cid;
    localStorage.removeItem('cartId');
    cid = null;
  }

  const res = await fetch('/api/carts', { method: 'POST' });
  if (!res.ok) {
    console.error('Error al crear carrito:', res.statusText);
    return null;
  }
  const data = await res.json();
  cid = data._id || data.id;
  if (cid) localStorage.setItem('cartId', cid);
  return cid;
}

// Escucho clicks en botones de "Agregar al carrito"
document.addEventListener('click', async e => {
  if (e.target.classList.contains('add-to-cart')) {
    const pid = e.target.getAttribute('data-id');
    const qtyInput = e.target.closest('.actions')?.querySelector('.add-qty');
    const quantity = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    const cid = await getCartId();
    if (cid) {
      const res = await fetch(`/api/carts/${cid}/product/${pid}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      if (res.ok) {
        const data = await res.json();
        if (res.status === 201 && data._id) {
          localStorage.setItem('cartId', data._id);
        }
        showToast('Producto agregado al carrito');
      } else {
        console.error('Error al agregar producto:', res.statusText);
      }
    }
  }
  if (e.target.classList.contains('remove-item')) {
    const pid = e.target.dataset.id;
    const cid = await getCartId();
    if (cid) {
      await fetch(`/api/carts/${cid}/products/${pid}`, { method: 'DELETE' });
      location.reload();
    }
  }
});

// Actualizar cantidades en el carrito
document.addEventListener('change', async e => {
  if (e.target.classList.contains('quantity-input')) {
    const pid = e.target.dataset.id;
    const quantity = parseInt(e.target.value) || 1;
    const cid = await getCartId();
    if (cid) {
      await fetch(`/api/carts/${cid}/products/${pid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      });
      location.reload();
    }
  }
});

// Vaciado completo del carrito
document.addEventListener('click', async e => {
  if (e.target.id === 'clearCart') {
    const cid = await getCartId();
    if (cid) {
      await fetch(`/api/carts/${cid}`, { method: 'DELETE' });
      location.reload();
    }
  }
});

