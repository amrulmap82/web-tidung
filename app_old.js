// ============================================
// KALKULATOR HPP CERDAS - APPLICATION LOGIC
// ============================================

// Data Storage
let products = JSON.parse(localStorage.getItem('hpp_products')) || [];
let currentProductId = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    registerServiceWorker();
});

function initializeApp() {
    setupEventListeners();
    renderProductsList();
}

// ============================================
// EVENT LISTENERS
// ============================================

function setupEventListeners() {
    // Tab Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Product Form
    document.getElementById('product-form').addEventListener('submit', handleAddProduct);
    document.getElementById('product-unit').addEventListener('change', handleUnitChange);

    // Ingredient Form
    document.getElementById('ingredient-form').addEventListener('submit', handleAddIngredient);

    // HPP Per Unit Input
    document.getElementById('hpp-per-unit-input').addEventListener('input', calculateHppPerUnit);

    // Export Buttons
    document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
    document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);

    // Delete Product Button
    document.getElementById('delete-product-btn').addEventListener('click', handleDeleteProduct);
}

// ============================================
// TAB NAVIGATION
// ============================================

function handleTabSwitch(e) {
    const tabName = e.target.dataset.tab;

    // Update active button
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    // Update active tab
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

// ============================================
// PRODUCT MANAGEMENT
// ============================================

function handleAddProduct(e) {
    e.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const weight = parseFloat(document.getElementById('product-weight').value);
    let unit = document.getElementById('product-unit').value;

    if (unit === 'custom') {
        unit = document.getElementById('custom-unit').value.trim();
        if (!unit) {
            alert('Silakan masukkan nama satuan custom');
            return;
        }
    }

    if (!name || !weight || !unit) {
        alert('Silakan lengkapi semua field');
        return;
    }

    const product = {
        id: Date.now(),
        name,
        weight,
        unit,
        ingredients: []
    };

    products.push(product);
    saveProducts();
    renderProductsList();
    resetProductForm();

    // Auto-select new product
    selectProduct(product.id);
}

function handleUnitChange(e) {
    const customUnitGroup = document.getElementById('custom-unit-group');
    if (e.target.value === 'custom') {
        customUnitGroup.style.display = 'block';
    } else {
        customUnitGroup.style.display = 'none';
    }
}

function selectProduct(productId) {
    currentProductId = productId;
    renderProductsList();
    renderProductDetail();
}

function handleDeleteProduct() {
    if (!currentProductId) return;

    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
        products = products.filter(p => p.id !== currentProductId);
        saveProducts();
        currentProductId = null;
        renderProductsList();
        renderProductDetail();
    }
}

function renderProductsList() {
    const container = document.getElementById('products-list');

    if (products.length === 0) {
        container.innerHTML = '<p class="empty-state">Belum ada produk. Tambahkan produk baru untuk memulai.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-item ${product.id === currentProductId ? 'active' : ''}" onclick="selectProduct(${product.id})">
            <div class="product-item-name">${escapeHtml(product.name)}</div>
            <div class="product-item-info">${product.weight} ${product.unit} • ${product.ingredients.length} bahan</div>
        </div>
    `).join('');
}

function renderProductDetail() {
    const detailSection = document.getElementById('product-detail');
    const noProductState = document.getElementById('no-product-state');

    if (!currentProductId) {
        detailSection.style.display = 'none';
        noProductState.style.display = 'block';
        return;
    }

    const product = products.find(p => p.id === currentProductId);
    if (!product) {
        detailSection.style.display = 'none';
        noProductState.style.display = 'block';
        return;
    }

    detailSection.style.display = 'block';
    noProductState.style.display = 'none';

    // Update product info
    document.getElementById('detail-product-name').textContent = product.name;
    document.getElementById('detail-product-info').textContent = `${product.weight} ${product.unit}`;

    // Reset ingredient form
    document.getElementById('ingredient-form').reset();

    // Render ingredients table
    renderIngredientsTable(product);

    // Calculate and display results
    calculateResults(product);
}

// ============================================
// INGREDIENT MANAGEMENT
// ============================================

function handleAddIngredient(e) {
    e.preventDefault();

    if (!currentProductId) {
        alert('Silakan pilih produk terlebih dahulu');
        return;
    }

    const name = document.getElementById('ingredient-name').value.trim();
    const price = parseFloat(document.getElementById('ingredient-price').value);
    const quantity = parseFloat(document.getElementById('ingredient-quantity').value);
    const unit = document.getElementById('ingredient-unit').value;

    if (!name || !price || !quantity || !unit) {
        alert('Silakan lengkapi semua field');
        return;
    }

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const submitBtn = document.querySelector('#ingredient-form button[type="submit"]');
    const editingId = submitBtn.dataset.editingId;

    if (editingId) {
        // Mode edit - update ingredient yang ada
        updateIngredient(parseInt(editingId), {
            name,
            price,
            quantity,
            unit
        });
    } else {
        // Mode tambah - buat ingredient baru
        const ingredient = {
            id: Date.now(),
            name,
            price,
            quantity,
            unit
        };

        product.ingredients.push(ingredient);
        saveProducts();
        renderIngredientsTable(product);
        calculateResults(product);
        document.getElementById('ingredient-form').reset();
    }
}

function deleteIngredient(ingredientId) {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    if (confirm('Apakah Anda yakin ingin menghapus bahan ini?')) {
        product.ingredients = product.ingredients.filter(i => i.id !== ingredientId);
        saveProducts();
        renderIngredientsTable(product);
        calculateResults(product);
    }
}

function startEditIngredient(ingredientId) {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const ingredient = product.ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;

    // Populate form dengan data ingredient
    document.getElementById('ingredient-name').value = ingredient.name;
    document.getElementById('ingredient-price').value = ingredient.price;
    document.getElementById('ingredient-quantity').value = ingredient.quantity;
    document.getElementById('ingredient-unit').value = ingredient.unit;

    // Scroll ke form
    document.getElementById('ingredient-form').scrollIntoView({ behavior: 'smooth' });

    // Set focus ke nama bahan
    document.getElementById('ingredient-name').focus();

    // Ubah tombol submit menjadi "Update"
    const submitBtn = document.querySelector('#ingredient-form button[type="submit"]');
    submitBtn.textContent = 'Update Bahan';
    submitBtn.dataset.editingId = ingredientId;

    // Tambah tombol cancel
    if (!document.getElementById('cancel-edit-btn')) {
        const cancelBtn = document.createElement('button');
        cancelBtn.id = 'cancel-edit-btn';
        cancelBtn.type = 'button';
        cancelBtn.className = 'btn btn-secondary';
        cancelBtn.textContent = 'Batal';
        cancelBtn.onclick = cancelEditIngredient;
        document.getElementById('ingredient-form').appendChild(cancelBtn);
    }
}

function cancelEditIngredient() {
    document.getElementById('ingredient-form').reset();
    const submitBtn = document.querySelector('#ingredient-form button[type="submit"]');
    submitBtn.textContent = 'Tambah Bahan';
    delete submitBtn.dataset.editingId;
    const cancelBtn = document.getElementById('cancel-edit-btn');
    if (cancelBtn) cancelBtn.remove();
}

function updateIngredient(ingredientId, updatedData) {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const ingredient = product.ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;

    Object.assign(ingredient, updatedData);
    saveProducts();
    renderIngredientsTable(product);
    calculateResults(product);
    cancelEditIngredient();
}

function renderIngredientsTable(product) {
    const tbody = document.getElementById('ingredients-tbody');
    const noIngredientsMsg = document.getElementById('no-ingredients');
    const tableContainer = document.getElementById('ingredients-table-container');

    if (product.ingredients.length === 0) {
        tableContainer.style.display = 'none';
        noIngredientsMsg.style.display = 'block';
        return;
    }

    tableContainer.style.display = 'block';
    noIngredientsMsg.style.display = 'none';

    tbody.innerHTML = product.ingredients.map(ingredient => {
        const subtotal = ingredient.price * ingredient.quantity;
        return `
            <tr class="ingredient-row" data-id="${ingredient.id}">
                <td class="cell-name">${escapeHtml(ingredient.name)}</td>
                <td class="cell-price">Rp ${formatNumber(ingredient.price)}</td>
                <td class="cell-quantity">${formatNumber(ingredient.quantity)}</td>
                <td class="cell-unit">${ingredient.unit}</td>
                <td class="cell-subtotal">Rp ${formatNumber(subtotal)}</td>
                <td class="cell-actions">
                    <button class="btn-edit" onclick="startEditIngredient(${ingredient.id})" title="Edit">✏️</button>
                    <button class="btn-delete" onclick="deleteIngredient(${ingredient.id})" title="Hapus">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// CALCULATIONS
// ============================================

function calculateResults(product) {
    const totalHpp = product.ingredients.reduce((sum, ing) => {
        return sum + (ing.price * ing.quantity);
    }, 0);

    document.getElementById('total-hpp').textContent = `Rp ${formatNumber(totalHpp)}`;

    // Reset HPP per unit
    document.getElementById('hpp-per-unit-input').value = '';
    document.getElementById('hpp-per-unit-result').textContent = 'Rp 0';
}

function calculateHppPerUnit() {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const totalHpp = product.ingredients.reduce((sum, ing) => {
        return sum + (ing.price * ing.quantity);
    }, 0);

    const unitInput = parseFloat(document.getElementById('hpp-per-unit-input').value);

    if (!unitInput || unitInput <= 0) {
        document.getElementById('hpp-per-unit-result').textContent = 'Rp 0';
        return;
    }

    const hppPerUnit = totalHpp / unitInput;
    document.getElementById('hpp-per-unit-result').textContent = `Rp ${formatNumber(hppPerUnit)}`;
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

function exportToPDF() {
    if (!currentProductId) {
        alert('Silakan pilih produk terlebih dahulu');
        return;
    }

    const product = products.find(p => p.id === currentProductId);
    if (!product || product.ingredients.length === 0) {
        alert('Silakan tambahkan bahan baku terlebih dahulu');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Title
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 95);
    doc.text('KALKULATOR HPP CERDAS', 20, 20);

    // Product Info
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Produk: ${product.name}`, 20, 35);
    doc.text(`Berat/Jumlah: ${product.weight} ${product.unit}`, 20, 42);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 49);

    // Table
    const tableData = product.ingredients.map(ing => [
        ing.name,
        `Rp ${formatNumber(ing.price)}`,
        formatNumber(ing.quantity),
        ing.unit,
        `Rp ${formatNumber(ing.price * ing.quantity)}`
    ]);

    doc.autoTable({
        head: [['Nama Bahan', 'Harga/Satuan', 'Jumlah', 'Satuan', 'Subtotal']],
        body: tableData,
        startY: 60,
        theme: 'grid',
        headStyles: {
            fillColor: [30, 58, 95],
            textColor: [255, 255, 255],
            fontStyle: 'bold'
        },
        bodyStyles: {
            textColor: [50, 50, 50]
        },
        alternateRowStyles: {
            fillColor: [245, 247, 250]
        }
    });

    // Total
    const totalHpp = product.ingredients.reduce((sum, ing) => sum + (ing.price * ing.quantity), 0);
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total HPP: Rp ${formatNumber(totalHpp)}`, 20, finalY);

    // HPP Per Unit
    const hppPerUnitInput = parseFloat(document.getElementById('hpp-per-unit-input').value);
    if (hppPerUnitInput && hppPerUnitInput > 0) {
        const hppPerUnit = totalHpp / hppPerUnitInput;
        doc.text(`HPP per ${hppPerUnitInput} ${product.unit}: Rp ${formatNumber(hppPerUnit)}`, 20, finalY + 8);
    }

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Dibuat dengan Kalkulator HPP Cerdas', 20, doc.internal.pageSize.height - 10);

    // Save
    doc.save(`HPP_${product.name}_${new Date().toISOString().split('T')[0]}.pdf`);
}

function exportToExcel() {
    if (!currentProductId) {
        alert('Silakan pilih produk terlebih dahulu');
        return;
    }

    const product = products.find(p => p.id === currentProductId);
    if (!product || product.ingredients.length === 0) {
        alert('Silakan tambahkan bahan baku terlebih dahulu');
        return;
    }

    const workbook = XLSX.utils.book_new();

    // Prepare data
    const data = [
        ['KALKULATOR HPP CERDAS'],
        [],
        ['Produk:', product.name],
        ['Berat/Jumlah:', `${product.weight} ${product.unit}`],
        ['Tanggal:', new Date().toLocaleDateString('id-ID')],
        [],
        ['Nama Bahan', 'Harga/Satuan', 'Jumlah', 'Satuan', 'Subtotal']
    ];

    // Add ingredients
    product.ingredients.forEach(ing => {
        data.push([
            ing.name,
            ing.price,
            ing.quantity,
            ing.unit,
            ing.price * ing.quantity
        ]);
    });

    // Add total
    const totalHpp = product.ingredients.reduce((sum, ing) => sum + (ing.price * ing.quantity), 0);
    data.push([]);
    data.push(['Total HPP:', totalHpp]);

    const hppPerUnitInput = parseFloat(document.getElementById('hpp-per-unit-input').value);
    if (hppPerUnitInput && hppPerUnitInput > 0) {
        const hppPerUnit = totalHpp / hppPerUnitInput;
        data.push([`HPP per ${hppPerUnitInput} ${product.unit}:`, hppPerUnit]);
    }

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Set column widths
    worksheet['!cols'] = [
        { wch: 25 },
        { wch: 15 },
        { wch: 12 },
        { wch: 10 },
        { wch: 15 }
    ];

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'HPP');

    // Save file
    XLSX.writeFile(workbook, `HPP_${product.name}_${new Date().toISOString().split('T')[0]}.xlsx`);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatNumber(num) {
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(num);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function resetProductForm() {
    document.getElementById('product-form').reset();
    document.getElementById('custom-unit-group').style.display = 'none';
}

function saveProducts() {
    localStorage.setItem('hpp_products', JSON.stringify(products));
}

// ============================================
// PWA - SERVICE WORKER
// ============================================

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker registration failed:', err);
        });
    }
}
