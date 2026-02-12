// app.js - Frontend Logic (Client-Server Architecture)
// ENGSE207 Software Architecture - Week 5 Lab

// ========================================
// PART 1: STATE & CONFIGURATION
// ========================================
let allTasks = [];
let currentFilter = 'ALL';

// ดึงค่าจาก config.js ที่โหลดมาก่อนหน้านี้
const API_BASE = API_CONFIG.BASE_URL;
const API = {
    TASKS: `${API_BASE}${API_CONFIG.ENDPOINTS.TASKS}`,
    STATS: `${API_BASE}${API_CONFIG.ENDPOINTS.STATS}`
};

// ========================================
// PART 2: DOM ELEMENTS
// ========================================
const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');

// ========================================
// PART 3: API FUNCTIONS
// ========================================

// 3.1 Fetch Tasks (ดึงข้อมูลทั้งหมดจาก VM)
async function fetchTasks() {
    showLoading();
    try {
        const response = await fetch(API.TASKS);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        // ปรับตามโครงสร้าง JSON ของ Backend (ปกติจะเป็น result.data หรือ result.tasks)
        allTasks = result.data || result.tasks || [];
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
        alert('❌ ไม่สามารถเชื่อมต่อกับ API Server ที่ VM ได้ (เช็ก IP และ CORS)');
    } finally {
        hideLoading();
    }
}

// 4.1 Create Task (ส่งข้อมูลไปบันทึกที่ VM)
async function createTask(taskData) {
    showLoading();
    try {
        const response = await fetch(API.TASKS, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const result = await response.json();
        const newTask = result.data || result.task;
        allTasks.unshift(newTask);
        renderTasks();
        
        addTaskForm.reset();
        alert('✅ สร้าง Task สำเร็จ!');
    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ สร้าง Task ล้มเหลว');
    } finally {
        hideLoading();
    }
}

// 5.1 Update Status (PATCH ไปยัง VM)
async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        // ใช้ Endpoint /next-status ตาม Lab Week 4/5
        const response = await fetch(`${API.TASKS}/${taskId}/next-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update status');

        const taskIndex = allTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            allTasks[taskIndex].status = newStatus;
        }
        renderTasks();
    } catch (error) {
        console.error('Error updating status:', error);
        alert('❌ อัปเดตสถานะล้มเหลว');
    } finally {
        hideLoading();
    }
}

// 6.1 Delete Task
async function deleteTask(taskId) {
    if (!confirm('ยืนยันการลบ Task นี้?')) return;
    
    showLoading();
    try {
        const response = await fetch(`${API.TASKS}/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');

        allTasks = allTasks.filter(t => t.id !== taskId);
        renderTasks();
        alert('✅ ลบ Task เรียบร้อย');
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ ลบ Task ล้มเหลว');
    } finally {
        hideLoading();
    }
}

// ========================================
// PART 7-10: RENDER FUNCTIONS
// ========================================

function renderTasks() {
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';
    
    let filteredTasks = currentFilter === 'ALL' 
        ? allTasks 
        : allTasks.filter(t => t.status === currentFilter);
    
    const todo = filteredTasks.filter(t => t.status === 'TODO');
    const progress = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
    const done = filteredTasks.filter(t => t.status === 'DONE');
    
    todoCount.textContent = todo.length;
    progressCount.textContent = progress.length;
    doneCount.textContent = done.length;
    
    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}

function renderTaskList(tasks, container, currentStatus) {
    if (tasks.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>ไม่มีงาน</p></div>';
        return;
    }
    tasks.forEach(task => {
        const card = createTaskCard(task, currentStatus);
        container.appendChild(card);
    });
}

function createTaskCard(task, currentStatus) {
    const card = document.createElement('div');
    card.className = 'task-card';
    const priorityClass = `priority-${task.priority.toLowerCase()}`;
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
        </div>
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        <div class="task-meta">📅 ${formatDate(task.created_at)}</div>
        <div class="task-actions">
            ${createStatusButtons(task.id, currentStatus)}
            <button class="btn btn-danger btn-sm" onclick="deleteTask(${task.id})">🗑️ ลบ</button>
        </div>
    `;
    return card;
}

function createStatusButtons(taskId, currentStatus) {
    const buttons = [];
    if (currentStatus !== 'TODO') {
        buttons.push(`<button class="btn btn-warning btn-sm" onclick="updateTaskStatus(${taskId}, 'TODO')">← To Do</button>`);
    }
    if (currentStatus !== 'IN_PROGRESS') {
        const label = currentStatus === 'TODO' ? '→ In Progress' : '← In Progress';
        buttons.push(`<button class="btn btn-info btn-sm" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">${label}</button>`);
    }
    if (currentStatus !== 'DONE') {
        buttons.push(`<button class="btn btn-success btn-sm" onclick="updateTaskStatus(${taskId}, 'DONE')">→ Done</button>`);
    }
    return buttons.join('');
}

// ========================================
// PART 11-14: UTILITIES & INIT
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('th-TH');
}

function showLoading() { loadingOverlay.style.display = 'flex'; }
function hideLoading() { loadingOverlay.style.display = 'none'; }

addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskData = {
        title: document.getElementById('taskTitle').value.trim(),
        description: document.getElementById('taskDescription').value.trim(),
        priority: document.getElementById('taskPriority').value
    };
    if (taskData.title) createTask(taskData);
});

statusFilter.addEventListener('change', (e) => {
    currentFilter = e.target.value;
    renderTasks();
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Client-Server App Initialized');
    fetchTasks();
});

// ให้ HTML เรียกใช้งานได้
window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;