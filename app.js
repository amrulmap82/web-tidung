// ============================================
// KALKULATOR HPP CERDAS V2 - APPLICATION LOGIC
// ============================================

// Data Storage
let products = JSON.parse(localStorage.getItem('hpp_products_v2')) || [];
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

    // Detail Tabs
    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
        btn.addEventListener('click', handleDetailTabSwitch);
    });

    // Product Form
    document.getElementById('product-form').addEventListener('submit', handleAddProduct);
    document.getElementById('product-unit').addEventListener('change', handleUnitChange);

    // Ingredient Form
    document.getElementById('ingredient-form').addEventListener('submit', handleAddIngredient);

    // Packaging Form
    document.getElementById('packaging-form').addEventListener('submit', handleAddPackaging);

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

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

function handleDetailTabSwitch(e) {
    const sectionName = e.target.dataset.section;

    document.querySelectorAll('.detail-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    e.target.classList.add('active');

    document.querySelectorAll('.detail-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`section-${sectionName}`).classList.add('active');
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
        ingredients: [],
        packagings: []
    };

    products.push(product);
    saveProducts();
    renderProductsList();
    resetProductForm();
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
        container.innerHTML = '<p class="empty-state">Belum ada produk</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-item ${product.id === currentProductId ? 'active' : ''}" onclick="selectProduct(${product.id})">
            <div class="product-item-name">${escapeHtml(product.name)}</div>
            <div class="product-item-info">${product.weight} ${product.unit} • ${product.ingredients.length} bahan • ${product.packagings.length} kemasan</div>
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

    document.getElementById('detail-product-name').textContent = product.name;
    document.getElementById('detail-product-info').textContent = `${product.weight} ${product.unit}`;

    // Reset forms
    document.getElementById('ingredient-form').reset();
    document.getElementById('packaging-form').reset();

    // Render tables
    renderIngredientsTable(product);
    renderPackagingTable(product);

    // Calculate results
    calculateResults(product);

    // Render recommendations
    renderRecommendations(product);
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
    const shop = document.getElementById('ingredient-shop').value.trim();
    const priceUnit = parseFloat(document.getElementById('ingredient-price-unit').value);
    const quantity = parseFloat(document.getElementById('ingredient-quantity').value);
    const unit = document.getElementById('ingredient-unit').value;
    const stock = parseFloat(document.getElementById('ingredient-stock').value);
    const minStock = parseFloat(document.getElementById('ingredient-min-stock').value);

    if (!name || !quantity || !unit || stock < 0 || minStock < 0) {
        alert('Silakan lengkapi semua field dengan benar');
        return;
    }

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const submitBtn = document.querySelector('#ingredient-form button[type="submit"]');
    const editingId = submitBtn.dataset.editingId;

    if (editingId) {
        updateIngredient(parseInt(editingId), {
            name,
            shop,
            priceUnit,
            quantity,
            unit,
            stock,
            minStock
        });
    } else {
        const ingredient = {
            id: Date.now(),
            name,
            shop,
            priceUnit,
            quantity,
            unit,
            stock,
            minStock
        };

        product.ingredients.push(ingredient);
        saveProducts();
        renderIngredientsTable(product);
        calculateResults(product);
        renderRecommendations(product);
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
        renderRecommendations(product);
    }
}

function startEditIngredient(ingredientId) {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const ingredient = product.ingredients.find(i => i.id === ingredientId);
    if (!ingredient) return;

    document.getElementById('ingredient-name').value = ingredient.name;
    document.getElementById('ingredient-shop').value = ingredient.shop || '';
    document.getElementById('ingredient-price-unit').value = ingredient.priceUnit || '';
    document.getElementById('ingredient-quantity').value = ingredient.quantity;
    document.getElementById('ingredient-unit').value = ingredient.unit;
    document.getElementById('ingredient-stock').value = ingredient.stock;
    document.getElementById('ingredient-min-stock').value = ingredient.minStock;

    document.getElementById('ingredient-form').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('ingredient-name').focus();

    const submitBtn = document.querySelector('#ingredient-form button[type="submit"]');
    submitBtn.textContent = 'Update Bahan';
    submitBtn.dataset.editingId = ingredientId;
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
    renderRecommendations(product);
    cancelEditIngredient();
}

function cancelEditIngredient() {
    document.getElementById('ingredient-form').reset();
    const submitBtn = document.querySelector('#ingredient-form button[type="submit"]');
    submitBtn.textContent = 'Tambah Bahan';
    delete submitBtn.dataset.editingId;
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
        const totalCost = ingredient.priceUnit * ingredient.quantity;
        const pricePerPart = ingredient.priceUnit / ingredient.quantity;

        return `
            <tr>
                <td>${escapeHtml(ingredient.name)}</td>
                <td>${escapeHtml(ingredient.shop)}</td>
                <td>Rp ${formatNumber(ingredient.priceUnit)}</td>
                <td>${formatNumber(ingredient.quantity)}</td>
                <td>${ingredient.unit}</td>
                <td>${formatNumber(ingredient.stock)} ${ingredient.unit}</td>
                <td>Rp ${formatNumber(pricePerPart)}</td>
                <td>
                    <button class="btn-edit" onclick="startEditIngredient(${ingredient.id})" title="Edit">✏️</button>
                    <button class="btn-delete" onclick="deleteIngredient(${ingredient.id})" title="Hapus">🗑️</button>
                </td>
            </tr>
        `;
    }).join('');
}

// ============================================
// PACKAGING MANAGEMENT
// ============================================

function handleAddPackaging(e) {
    e.preventDefault();

    if (!currentProductId) {
        alert('Silakan pilih produk terlebih dahulu');
        return;
    }

    const name = document.getElementById('packaging-name').value.trim();
    const size = document.getElementById('packaging-size').value.trim();
    const price = parseFloat(document.getElementById('packaging-price').value);

    if (!name || !size || !price) {
        alert('Silakan lengkapi semua field');
        return;
    }

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const submitBtn = document.querySelector('#packaging-form button[type="submit"]');
    const editingId = submitBtn.dataset.editingId;

    if (editingId) {
        updatePackaging(parseInt(editingId), { name, size, price });
    } else {
        const packaging = {
            id: Date.now(),
            name,
            size,
            price
        };

        product.packagings.push(packaging);
        saveProducts();
        renderPackagingTable(product);
        calculateResults(product);
        document.getElementById('packaging-form').reset();
    }
}

function deletePackaging(packagingId) {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    if (confirm('Apakah Anda yakin ingin menghapus kemasan ini?')) {
        product.packagings = product.packagings.filter(p => p.id !== packagingId);
        saveProducts();
        renderPackagingTable(product);
        calculateResults(product);
    }
}

function startEditPackaging(packagingId) {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const packaging = product.packagings.find(p => p.id === packagingId);
    if (!packaging) return;

    document.getElementById('packaging-name').value = packaging.name;
    document.getElementById('packaging-size').value = packaging.size;
    document.getElementById('packaging-price').value = packaging.price;

    document.getElementById('packaging-form').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('packaging-name').focus();

    const submitBtn = document.querySelector('#packaging-form button[type="submit"]');
    submitBtn.textContent = 'Update Kemasan';
    submitBtn.dataset.editingId = packagingId;
}

function updatePackaging(packagingId, updatedData) {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const packaging = product.packagings.find(p => p.id === packagingId);
    if (!packaging) return;

    Object.assign(packaging, updatedData);
    saveProducts();
    renderPackagingTable(product);
    calculateResults(product);
    cancelEditPackaging();
}

function cancelEditPackaging() {
    document.getElementById('packaging-form').reset();
    const submitBtn = document.querySelector('#packaging-form button[type="submit"]');
    submitBtn.textContent = 'Tambah Kemasan';
    delete submitBtn.dataset.editingId;
}

function renderPackagingTable(product) {
    const tbody = document.getElementById('packaging-tbody');
    const noPackagingMsg = document.getElementById('no-packaging');
    const tableContainer = document.getElementById('packaging-table-container');

    if (product.packagings.length === 0) {
        tableContainer.style.display = 'none';
        noPackagingMsg.style.display = 'block';
        return;
    }

    tableContainer.style.display = 'block';
    noPackagingMsg.style.display = 'none';

    tbody.innerHTML = product.packagings.map(packaging => `
        <tr>
            <td>${escapeHtml(packaging.name)}</td>
            <td>${escapeHtml(packaging.size)}</td>
            <td>Rp ${formatNumber(packaging.price)}</td>
            <td>
                <button class="btn-edit" onclick="startEditPackaging(${packaging.id})" title="Edit">✏️</button>
                <button class="btn-delete" onclick="deletePackaging(${packaging.id})" title="Hapus">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// ============================================
// CALCULATIONS
// ============================================

function calculateResults(product) {
    // Total ingredient cost
    const totalIngredientCost = product.ingredients.reduce((sum, ing) => {
        return sum + (ing.priceUnit * ing.quantity);
    }, 0);

    // Total packaging cost
    const totalPackagingCost = product.packagings.reduce((sum, pkg) => {
        return sum + pkg.price;
    }, 0);

    // Total HPP
    const totalHpp = totalIngredientCost + totalPackagingCost;

    document.getElementById('total-ingredient-cost').textContent = `Rp ${formatNumber(totalIngredientCost)}`;
    document.getElementById('total-packaging-cost').textContent = `Rp ${formatNumber(totalPackagingCost)}`;
    document.getElementById('total-hpp').textContent = `Rp ${formatNumber(totalHpp)}`;

    // Reset HPP per unit
    document.getElementById('hpp-per-unit-input').value = '';
    document.getElementById('hpp-per-unit-result').textContent = 'Rp 0';
}

function calculateHppPerUnit() {
    if (!currentProductId) return;

    const product = products.find(p => p.id === currentProductId);
    if (!product) return;

    const totalIngredientCost = product.ingredients.reduce((sum, ing) => {
        return sum + (ing.priceUnit * ing.quantity);
    }, 0);

    const totalPackagingCost = product.packagings.reduce((sum, pkg) => {
        return sum + pkg.price;
    }, 0);

    const totalHpp = totalIngredientCost + totalPackagingCost;
    const unitInput = parseFloat(document.getElementById('hpp-per-unit-input').value);

    if (!unitInput || unitInput <= 0) {
        document.getElementById('hpp-per-unit-result').textContent = 'Rp 0';
        return;
    }

    const hppPerUnit = totalHpp / unitInput;
    document.getElementById('hpp-per-unit-result').textContent = `Rp ${formatNumber(hppPerUnit)}`;
}

// ============================================
// RECOMMENDATIONS
// ============================================

function renderRecommendations(product) {
    const container = document.getElementById('recommendations-container');
    const lowStockIngredients = product.ingredients.filter(ing => ing.stock <= ing.minStock);

    if (lowStockIngredients.length === 0) {
        container.innerHTML = '<p class="empty-state">Tidak ada rekomendasi pembelian saat ini</p>';
        return;
    }

    container.innerHTML = lowStockIngredients.map(ing => `
        <div class="recommendation-card">
            <h5>⚠️ ${escapeHtml(ing.name)}</h5>
            <p><strong>Toko:</strong> ${escapeHtml(ing.shop || 'Tidak ada')}</p>
            <p><strong>Harga per Buah:</strong> Rp ${formatNumber(ing.priceUnit)}</p>
            <div class="stock-info">
                <p><strong>Stok Saat Ini:</strong> ${formatNumber(ing.stock)} ${ing.unit}</p>
                <p><strong>Stok Minimal:</strong> ${formatNumber(ing.minStock)} ${ing.unit}</p>
                <p style="color: #d32f2f; margin-top: 0.5rem;"><strong>Status:</strong> Stok hampir habis! Segera pesan.</p>
            </div>
        </div>
    `).join('');
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

    doc.setFont('helvetica');
    doc.setFontSize(18);
    doc.setTextColor(30, 58, 95);
    doc.text('KALKULATOR HPP CERDAS', 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(`Produk: ${product.name}`, 20, 35);
    doc.text(`Berat/Jumlah: ${product.weight} ${product.unit}`, 20, 42);
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 49);

    // Ingredients Table
    const ingredientData = product.ingredients.map(ing => [
        ing.name,
        ing.shop,
        `Rp ${formatNumber(ing.priceUnit)}`,
        formatNumber(ing.quantity),
        ing.unit,
        `Rp ${formatNumber(ing.priceUnit * ing.quantity)}`
    ]);

    doc.autoTable({
        head: [['Nama Bahan', 'Toko', 'Harga/Buah', 'Qty', 'Satuan', 'Subtotal']],
        body: ingredientData,
        startY: 60,
        theme: 'grid',
        headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255], fontStyle: 'bold' },
        bodyStyles: { textColor: [50, 50, 50] },
        alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    // Packaging Table
    if (product.packagings.length > 0) {
        const packagingData = product.packagings.map(pkg => [
            pkg.name,
            pkg.size,
            `Rp ${formatNumber(pkg.price)}`
        ]);

        doc.autoTable({
            head: [['Nama Kemasan', 'Ukuran', 'Harga']],
            body: packagingData,
            startY: finalY,
            theme: 'grid',
            headStyles: { fillColor: [30, 58, 95], textColor: [255, 255, 255], fontStyle: 'bold' },
            bodyStyles: { textColor: [50, 50, 50] },
            alternateRowStyles: { fillColor: [245, 247, 250] }
        });

        finalY = doc.lastAutoTable.finalY + 10;
    }

    // Summary
    const totalIngredientCost = product.ingredients.reduce((sum, ing) => sum + (ing.priceUnit * ing.quantity), 0);
    const totalPackagingCost = product.packagings.reduce((sum, pkg) => sum + pkg.price, 0);
    const totalHpp = totalIngredientCost + totalPackagingCost;

    doc.setFontSize(12);
    doc.setTextColor(30, 58, 95);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Biaya Bahan: Rp ${formatNumber(totalIngredientCost)}`, 20, finalY);
    doc.text(`Total Biaya Kemasan: Rp ${formatNumber(totalPackagingCost)}`, 20, finalY + 8);
    doc.text(`Total HPP: Rp ${formatNumber(totalHpp)}`, 20, finalY + 16);

    const hppPerUnitInput = parseFloat(document.getElementById('hpp-per-unit-input').value);
    if (hppPerUnitInput && hppPerUnitInput > 0) {
        const hppPerUnit = totalHpp / hppPerUnitInput;
        doc.text(`HPP per ${hppPerUnitInput} ${product.unit}: Rp ${formatNumber(hppPerUnit)}`, 20, finalY + 24);
    }

    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text('Dibuat dengan Kalkulator HPP Cerdas', 20, doc.internal.pageSize.height - 10);

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
    const data = [
        ['KALKULATOR HPP CERDAS'],
        [],
        ['Produk:', product.name],
        ['Berat/Jumlah:', `${product.weight} ${product.unit}`],
        ['Tanggal:', new Date().toLocaleDateString('id-ID')],
        [],
        ['BAHAN BAKU'],
        ['Nama Bahan', 'Toko', 'Harga/Buah', 'Qty', 'Satuan', 'Stok', 'Subtotal']
    ];

    product.ingredients.forEach(ing => {
        data.push([
            ing.name,
            ing.shop,
            ing.priceUnit,
            ing.quantity,
            ing.unit,
            ing.stock,
            ing.priceUnit * ing.quantity
        ]);
    });

    data.push([]);
    data.push(['KEMASAN']);
    data.push(['Nama Kemasan', 'Ukuran', 'Harga']);

    product.packagings.forEach(pkg => {
        data.push([pkg.name, pkg.size, pkg.price]);
    });

    data.push([]);
    const totalIngredientCost = product.ingredients.reduce((sum, ing) => sum + (ing.priceUnit * ing.quantity), 0);
    const totalPackagingCost = product.packagings.reduce((sum, pkg) => sum + pkg.price, 0);
    const totalHpp = totalIngredientCost + totalPackagingCost;

    data.push(['Total Biaya Bahan:', totalIngredientCost]);
    data.push(['Total Biaya Kemasan:', totalPackagingCost]);
    data.push(['Total HPP:', totalHpp]);

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    worksheet['!cols'] = [
        { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 12 },
        { wch: 10 }, { wch: 12 }, { wch: 15 }
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'HPP');
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
    localStorage.setItem('hpp_products_v2', JSON.stringify(products));
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
