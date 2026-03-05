let debounceTimer;
async function loadData() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        const filters = {
            department: document.getElementById('filterDept').value,
            yop: document.getElementById('filterYop').value,
            cgpa: document.getElementById('filterCgpa').value,
            search: document.getElementById('searchInput').value
        };

        const queryParams = new URLSearchParams(Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v)
        )).toString();

        try {
            const response = await fetch(`/api/registrations/all?${queryParams}`);
            const result = await response.json();

            if (result.success) {
                renderTable(result.data);
                document.getElementById('totalCount').textContent = result.data.length;
            }
        } catch (error) {
            console.error('Failed to load registrations:', error);
        }
    }, 300); // 300ms debounce
}

function renderTable(data) {
    const tbody = document.getElementById('registryTable');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-5 text-muted">No candidate records found matching your criteria.</td></tr>';
        return;
    }

    data.forEach(reg => {
        const row = `
            <tr>
                <td><span class="badge bg-light text-dark border px-2 py-1">${reg.registration_id}</span></td>
                <td>
                    <div class="fw-bold">${reg.full_name}</div>
                    <div class="small text-muted" style="font-size: 0.8rem;">${reg.email}</div>
                </td>
                <td><span class="badge-dept">${reg.department}</span></td>
                <td>
                    <div class="d-flex align-items-center">
                        <span class="fw-bold me-2">${reg.current_cgpa}</span>
                        <div class="progress w-100" style="height: 4px; background: #e2e8f0;">
                            <div class="progress-bar" role="progressbar" style="width: ${reg.current_cgpa * 10}%; background: var(--primary-gradient);"></div>
                        </div>
                    </div>
                </td>
                <td><span class="text-dark fw-medium">${reg.yop}</span></td>
                <td>
                    <div class="small">${reg.mobile}</div>
                </td>
                <td>
                    <a href="${reg.resume_path.startsWith('http') ? reg.resume_path : '/' + reg.resume_path.replace(/\\/g, '/')}" target="_blank" class="btn btn-sm btn-light border-0 shadow-sm px-3">
                        <i class="bi bi-file-earmark-pdf text-danger me-1"></i> Resume
                    </a>
                </td>
                <td>
                    <button class="btn btn-sm btn-link text-primary p-0 text-decoration-none fw-bold" onclick="alert('Student ID: ${reg.registration_id}')">
                        DETAILS
                    </button>
                </td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterDept').value = '';
    document.getElementById('filterYop').value = '';
    document.getElementById('filterCgpa').value = '';
    loadData();
}

document.getElementById('exportBtn').addEventListener('click', (e) => {
    e.preventDefault();
    const filters = {
        department: document.getElementById('filterDept').value,
        yop: document.getElementById('filterYop').value,
        cgpa: document.getElementById('filterCgpa').value,
        search: document.getElementById('searchInput').value
    };

    const queryParams = new URLSearchParams(Object.fromEntries(
        Object.entries(filters).filter(([_, v]) => v)
    )).toString();

    window.location.href = `/api/registrations/export?${queryParams}`;
});

// Initial load
document.addEventListener('DOMContentLoaded', loadData);
