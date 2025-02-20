// 자원 정보 (회의실 및 차량) - 각 회의실이나 자원의 정보를 담고 있는 배열
const groups = [
  { id: 1, content: "Conference Room 1" },
  { id: 2, content: "Conference Room 2" },
  { id: 3, content: "Conference Room 3" },
  { id: 4, content: "Conference Room 4" },
  { id: 5, content: "Conference Room 5" },
];

// 오늘 날짜와 타임라인 시작/끝 시간 설정
let today = new Date();
let startTime = setTime(today, 9, 0);
let endTime = setTime(today, 18, 0);

// 회의실 예약 데이터
let events = [
  {
    id: 1,
    group: 1,
    content: "팀 회의",
    start: new Date("2025-02-18T10:00:00"),
    end: new Date("2025-02-18T11:00:00"),
    employee: "한민정",
  },
  {
    id: 2,
    group: 1,
    content: "화면 설계 회의",
    start: new Date("2025-02-18T11:10:00"),
    end: new Date("2025-02-18T13:00:00"),
    employee: "한민정",
  },
  {
    id: 3,
    group: 2,
    content: "디자인 리뷰",
    start: new Date("2025-02-18T13:30:00"),
    end: new Date("2025-02-18T15:00:00"),
    employee: "한민정",
  },
];

// 타임라인 및 모달 설정
const container = document.getElementById("timeline");
const modal = document.getElementById("myModal");

// 타임라인 옵션 설정
const options = {
  stack: false,
  editable: true,
  moveable: false,
  timeAxis: { scale: "minute", step: 30 },
  orientation: { axis: "top" },
  start: startTime,
  end: endTime,
  margin: { axis: 0, item: { horizontal: 0, vertical: 0 } },
  showTooltips: true,
  onAdd: handleAddEvent,
  onUpdate: handleUpdateEvent,
  onMove: handleMoveEvent,
  onRemove: handleRemoveEvent,
};

// 타임라인 생성
const timeline = new vis.Timeline(container, events, groups, options);

// 페이지 로드 후 초기 설정
document.addEventListener("DOMContentLoaded", () => {
  modal.style.display = "none";
  window.onclick = (event) => {
    if (event.target === modal) modal.style.display = "none";
  };
  showData(); // 초기 데이터 테이블 표시
});

// 예약 모달의 submit 함수
document.getElementById("reservationForm").onsubmit = (event) => {
  event.preventDefault();
  const newEvent = getEventDataFromForm();
  handleEventSubmit(newEvent);
};

// 타임라인 이벤트 처리
function handleAddEvent(item) {
  onDoubleClick(item);
}
function handleUpdateEvent(item) {
  onDoubleClick(item, item.id);
}
function handleMoveEvent(item) {
  const eventIdx = findEventIndexById(item.id);
  events[eventIdx] = {
    ...events[eventIdx],
    group: item.group,
    start: item.start,
    end: item.end,
  };
  timeline.setItems(events);
}
function handleRemoveEvent(item) {
  const eventIdx = findEventIndexById(item.id);
  events.splice(eventIdx, 1);
  timeline.setItems(events);
}

// 예약 모달 열기 및 데이터 설정
function onDoubleClick(item, id) {
  modal.style.display = "block";
  openModal(item, id);
}

// 모달 데이터 채우기
function openModal(item, id) {
  const groupName = getGroupNameById(item.group);
  if (id) {
    const event = events.find((e) => e.id === id);
    setModalForm(event, groupName);
  } else {
    setModalForm({ group: item.group, start: item.start }, groupName);
  }
}

// 그룹 ID로 그룹명 얻기
function getGroupNameById(groupId) {
  const group = groups.find((g) => g.id === Number(groupId));
  return group ? group.content : "";
}

// 모달 폼에 데이터 설정
function setModalForm(event, groupName) {
  document.getElementById("id").value = event.id || "";
  document.getElementById("group").value = event.group || "";
  document.getElementById("content").value = event.content || "";
  document.getElementById("resource_name").value = groupName;
  document.getElementById("start").value = formatDate(event.start);
  document.getElementById("end").value = formatDate(event.end || "");
}

// 예약 데이터 폼에서 가져오기
function getEventDataFromForm() {
  return {
    id: document.getElementById("id").value || events.length + 1,
    group: document.getElementById("group").value,
    content: document.getElementById("content").value,
    start: new Date(document.getElementById("start").value),
    end: new Date(document.getElementById("end").value),
    employee: "한민정",
  };
}

// 예약 제출 처리
function handleEventSubmit(newEvent) {
  const eventIdx = findEventIndexById(newEvent.id);
  if (eventIdx !== -1) {
    events[eventIdx] = newEvent;
  } else {
    events.push(newEvent);
  }
  timeline.setItems(events);
  modal.style.display = "none";
}

// 예약 데이터 테이블 표시
function showData() {
  const tbody = document.getElementById("reservation-tbody");
  let html = events
    .map((event) => {
      const groupName = getGroupNameById(event.group);
      return `<tr>
                <td>${event.id}</td>
                <td>${event.employee}</td>
                <td>${formatDate(event.start)}</td>
                <td>${formatDate(event.end)}</td>
                <td>${groupName}</td>
              </tr>`;
    })
    .join("");
  tbody.innerHTML = html;
}

// 날짜 형식 변환
function formatDate(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}T${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// 특정 ID로 이벤트 찾기
function findEventIndexById(id) {
  return events.findIndex((e) => e.id === id);
}

// 타임라인 날짜 변경
function changeDate(offset) {
  today.setDate(today.getDate() + offset);
  startTime = setTime(today, 9, 0);
  endTime = setTime(today, 18, 0);
  options.start = startTime;
  options.end = endTime;
  timeline.setOptions({ ...options, start: startTime, end: endTime });
}

function prevDate() {
  changeDate(-1);
}
function nextDate() {
  changeDate(1);
}

// 시간을 설정하는 함수
function setTime(date, hours, minutes) {
  return new Date(date.setHours(hours, minutes, 0, 0));
}
