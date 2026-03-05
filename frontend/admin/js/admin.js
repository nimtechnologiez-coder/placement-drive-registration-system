async function loadData() {
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
}

function renderTable(data) {
    const tbody = document.getElementById('registryTable');
    tbody.innerHTML = '';

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4">No records found.</td></tr>';
        return;
    }

    data.forEach(reg => {
        const row = `
            <tr>
                <td><span class="badge bg-light text-dark border">${reg.registration_id}</span></td>
                <td>
                    <div class="fw-bold">${reg.full_name}</div>
                    <small class="text-muted">${reg.email}</small>
                </td>
                <td><span class="badge badge-dept">${reg.department}</span></td>
                <td>${reg.current_cgpa}</td>
                <td>${reg.yop}</td>
                <td>${reg.mobile}</td>
                <td>
                    <a href="${reg.resume_path.startsWith('http') ? reg.resume_path : '/' + reg.resume_path.replace(/\\/g, '/')}" target="_blank" class="btn btn-sm btn-outline-info">
                        <i class="bi bi-file-earmark-pdf"></i> View
                    </a>
                </td>
                <td>${new Date(reg.created_at).toLocaleDateString()}</td>
            </tr>
        `;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

document.getElementById('exportBtn').addEventListener('click', () => {
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
