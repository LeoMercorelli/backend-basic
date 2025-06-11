// Script para manejar la lista de productos desde el navegador
// Lo escribí para practicar fetch y manipulación del DOM

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('productList');
  const searchInput = document.getElementById('searchInput');
  const categoryInput = document.getElementById('categoryInput');
  const statusSelect = document.getElementById('statusSelect');
  const sortSelect = document.getElementById('sortSelect');
  const addForm = document.getElementById('addProduct');
  const editForm = document.getElementById('editProduct');
  const editSection = document.getElementById('editProductSection');
  const cancelEdit = document.getElementById('cancelEdit');
  const pagination = document.getElementById('pagination');

  let page = 1;
  let limit = 5;
  let sort = '';
  let category = '';
  let status = '';
  let search = '';

  async function loadProducts() {
    const params = new URLSearchParams({ limit, page });
    if (sort) params.append('sort', sort);
    if (status) params.append('query', status);
    else if (category) params.append('query', category);
    if (search) params.append('search', search);
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    const products = data.payload;
    renderProducts(products);
    renderPagination(data);
    const qs = new URLSearchParams();
    if (page) qs.append('page', page);
    if (sort) qs.append('sort', sort);
    if (category) qs.append('category', category);
    if (status) qs.append('status', status);
    if (search) qs.append('search', search);
    history.replaceState(null, '', `/products?${qs.toString()}`);
  }

  function renderProducts(products) {
    list.innerHTML = '';
    products.forEach(p => {
      const li = document.createElement('li');
      li.className = 'product-card';
      li.innerHTML = `
        <h3>${p.title}</h3>
        <p>Precio: $${p.price}</p>
        <p>Categoría: ${p.category || ''}</p>
        <p>Stock: ${p.stock}</p>
        <p>Estado: ${p.status}</p>
        <a href="/products/${p._id}">Ver detalles</a>
        <div class="actions d-flex align-items-center gap-1">
          <input type="number" class="add-qty form-control form-control-sm" value="1" min="1" max="${p.stock}" />
          <button class="btn btn-primary btn-sm add-to-cart" data-id="${p._id}">Agregar al carrito</button>
          <button class="btn btn-secondary btn-sm edit-product" data-id="${p._id}">Editar</button>
          <button class="btn btn-danger btn-sm delete-product" data-id="${p._id}">Eliminar</button>
        </div>`;
      list.appendChild(li);
    });
  }

  function renderPagination(info) {
    pagination.innerHTML = '';
    if (info.totalPages <= 1) return;
    if (info.hasPrevPage) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = 'Anterior';
      a.addEventListener('click', e => {
        e.preventDefault();
        page = info.prevPage;
        loadProducts();
      });
      pagination.appendChild(a);
    }

    for (let i = 1; i <= info.totalPages; i++) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = i;
      if (i === info.page) a.className = 'active';
      a.addEventListener('click', e => {
        e.preventDefault();
        page = i;
        loadProducts();
      });
      pagination.appendChild(a);
    }

    if (info.hasNextPage) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = 'Siguiente';
      a.addEventListener('click', e => {
        e.preventDefault();
        page = info.nextPage;
        loadProducts();
      });
      pagination.appendChild(a);
    }
  }

  searchInput.addEventListener('input', () => {
    search = searchInput.value.trim();
    page = 1;
    loadProducts();
  });

  categoryInput.addEventListener('input', () => {
    category = categoryInput.value.trim();
    page = 1;
    loadProducts();
  });

  statusSelect.addEventListener('change', () => {
    status = statusSelect.value;
    page = 1;
    loadProducts();
  });

  sortSelect.addEventListener('change', () => {
    sort = sortSelect.value;
    page = 1;
    loadProducts();
  });

  addForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(addForm));
    data.thumbnails = [];
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (res.ok) {
      addForm.reset();
      loadProducts();
    } else {
      alert('Error al agregar');
    }
  });

  document.addEventListener('click', async e => {
    if (e.target.classList.contains('delete-product')) {
      const id = e.target.dataset.id;
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      loadProducts();
    }
    if (e.target.classList.contains('edit-product')) {
      const id = e.target.dataset.id;
      const res = await fetch(`/api/products/${id}`);
      const prod = await res.json();
      editForm.elements.title.value = prod.title;
      editForm.elements.description.value = prod.description;
      editForm.elements.code.value = prod.code;
      editForm.elements.price.value = prod.price;
      editForm.elements.category.value = prod.category || '';
      editForm.elements.stock.value = prod.stock || 0;
      editForm.elements.status.value = String(prod.status);
      editForm.dataset.id = id;
      editSection.style.display = 'block';
      window.scrollTo(0, 0);
    }
  });

  cancelEdit.addEventListener('click', () => {
    editSection.style.display = 'none';
  });

  editForm.addEventListener('submit', async e => {
    e.preventDefault();
    const id = editForm.dataset.id;
    const data = Object.fromEntries(new FormData(editForm));
    data.thumbnails = [];
    await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    editForm.reset();
    editSection.style.display = 'none';
    loadProducts();
  });

  loadProducts();
});
