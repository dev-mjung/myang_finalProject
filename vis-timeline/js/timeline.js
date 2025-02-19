// 자원 정보 (회의실 및 차량) - 각 회의실이나 자원의 정보를 담고 있는 배열
const groups = [
  { id: "1", content: "Conference Room 1" },
  { id: "2", content: "Conference Room 2" },
  { id: "3", content: "Conference Room 3" },
  { id: "4", content: "Conference Room 4" },
  { id: "5", content: "Conference Room 5" },
];

let today = new Date();
let startTime = setTime(today, 9, 0);
let endTime = setTime(today, 18, 0);

// 회의실 예약 데이터 - 예약 정보는 이벤트 객체로 저장
let events = [
  {
    id: "1",
    group: "1",
    content: "팀 회의",
    start: new Date("2025-02-18T10:00:00"),
    end: new Date("2025-02-18T11:00:00"),
    employee: "한민정",
  },
  {
    id: "2",
    group: "1",
    content: "화면 설계 회의",
    start: new Date("2025-02-18T11:10:00"),
    end: new Date("2025-02-18T13:00:00"),
    employee: "한민정",
  },
  {
    id: "3",
    group: "2",
    content: "디자인 리뷰",
    start: new Date("2025-02-18T13:30:00"),
    end: new Date("2025-02-18T15:00:00"),
    employee: "한민정",
  },
];

// 타임라인 컨테이너 및 모달 설정
const container = document.getElementById("timeline"); // 타임라인을 표시할 HTML 요소
const modal = document.getElementById("myModal"); // 예약 수정/추가를 위한 모달

// 타임라인 옵션 설정
const options = {
  stack: false, // 예약이 겹치면 쌓이게 할지 여부
  editable: true, // 예약 항목 수정 가능
  moveable: false, // 예약 항목을 드래그로 이동할 수 없게 설정
  timeAxis: { scale: "minute", step: 30 }, // 30분 간격으로 노출
  orientation: { axis: "top" }, // Orientation of the timeline axis
  start: startTime, // 타임라인 시작 시간
  end: endTime, // 타임라인 끝 시간
  // showCurrentTime: true, // 현재 시간 표시
  margin: { axis: 0, item: { horizontal: 0, vertical: 0 } }, // 예약 항목 간 간격
  showTooltips: true,
  onAdd: handleAddEvent, // 새 예약 항목 추가 시 호출될 함수
  onUpdate: handleUpdateEvent, // 예약 항목 수정 시 호출될 함수
  onMove: handleMoveEvent, // 예약 항목 이동 시 호출될 함수
  onRemove: handleRemoveEvent, // 예약 항목 삭제 시 호출될 함수
};

// 타임라인 생성
const timeline = new vis.Timeline(container, events, groups, options);

// 페이지 로드 후 초기 설정
document.addEventListener("DOMContentLoaded", function () {
  modal.style.display = "none"; // 페이지가 로드되면 모달을 숨김
  window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none"; // 모달 바깥을 클릭하면 모달 숨기기
  };
  showData(); // 초기 데이터 테이블 표시
});

// 예약 모달의 submit 함수 - 예약 추가/수정 시 호출
document.getElementById("reservationForm").onsubmit = function (event) {
  event.preventDefault(); // 페이지 리로드 방지
  const newEvent = getEventDataFromForm(); // 폼 데이터에서 예약 정보를 가져옴
  handleEventSubmit(newEvent); // 예약 처리 함수 호출
};

// 새 예약 추가 또는 기존 예약 수정
function handleAddEvent(item) {
  onDoubleClick(item); // 새로운 예약 추가 시 모달을 열어 데이터 입력
}

function handleUpdateEvent(item) {
  onDoubleClick(item, item.id); // 기존 예약 수정 시 모달을 열어 데이터 수정
}

function handleMoveEvent(item) {
  // 예약 항목이 이동되었을 때, 이벤트 배열을 업데이트
  const eventIdx = getEventIndexById(item.id); // 이동한 이벤트의 인덱스를 찾음
  events[eventIdx] = {
    ...events[eventIdx],
    group: item.group,
    start: item.start,
    end: item.end,
  };
  timeline.setItems(events); // 타임라인에 업데이트된 이벤트 목록을 반영
}

function handleRemoveEvent(item) {
  // 예약 항목이 삭제되었을 때, 이벤트 배열에서 해당 항목을 제거
  const eventIdx = getEventIndexById(item.id); // 삭제할 이벤트의 인덱스를 찾음
  events.splice(eventIdx, 1); // 배열에서 해당 이벤트 제거
  timeline.setItems(events); // 타임라인에 업데이트된 이벤트 목록을 반영
}

// 예약 모달을 열고 데이터 세팅
function onDoubleClick(item, id) {
  modal.style.display = "block"; // 모달을 열기
  openModal(item, id); // 모달에 데이터 세팅
}

// 모달에 데이터 채우기 (수정 또는 추가)
function openModal(item, id) {
  const groupName = getGroupNameById(item.group); // 자원 이름 (회의실 이름 등) 가져오기
  if (id) {
    const event = events.find((e) => e.id == id); // 수정할 이벤트 찾기
    setModalForm(event, groupName); // 모달 폼에 데이터 채우기
  } else {
    setModalForm({ group: item.group, start: item.start }, groupName); // 새 예약 추가 시 폼 초기화
  }
}

// 그룹 id로 그룹명 (회의실 이름) 얻기
function getGroupNameById(groupId) {
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].id == groupId) {
      return groups[i].content; // 해당 그룹의 이름을 반환
    }
  }
  return ""; // 그룹을 찾지 못하면 빈 문자열 반환
}

// 모달 폼에 데이터 설정
function setModalForm(event, groupName) {
  document.getElementById("id").value = event.id || ""; // 예약 ID (없으면 빈 값)
  document.getElementById("group").value = event.group || ""; // 자원 그룹 ID
  document.getElementById("content").value = event.content || ""; // 예약 내용
  document.getElementById("resource_name").value = groupName; // 자원 이름
  document.getElementById("start").value = formatDate(event.start); // 시작 시간
  document.getElementById("end").value = formatDate(event.end || ""); // 끝 시간 (없으면 빈 값)
}

// ID로 이벤트 찾기
function getEventIndexById(id) {
  for (let i = 0; i < events.length; i++) {
    if (events[i].id == id) {
      return i; // 해당 ID를 가진 이벤트의 인덱스를 반환
    }
  }
  return -1; // 해당 ID를 가진 이벤트가 없으면 -1 반환
}

// 날짜 형식 변환 (YYYY-MM-DDTHH:mm 형식으로 변환)
function formatDate(date) {
  const d = new Date(date); // Date 객체 생성
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// 예약 데이터 폼에서 가져오기
function getEventDataFromForm() {
  return {
    id: document.getElementById("id").value || events.length + 1, // 수정 시 ID 유지, 새로 추가 시 새로운 ID 부여
    group: document.getElementById("group").value, // 자원 그룹 ID
    content: document.getElementById("content").value, // 예약 내용
    start: new Date(document.getElementById("start").value), // 시작 시간
    end: new Date(document.getElementById("end").value), // 끝 시간
    employee: "한민정", // 예약자 (예시로 한민정 사용)
  };
}

// 예약 제출 처리 (새로운 이벤트 추가/기존 이벤트 수정)
function handleEventSubmit(newEvent) {
  const eventIdx = getEventIndexById(newEvent.id); // 기존 이벤트 수정
  if (eventIdx !== -1) {
    console.log("수정 :: ", newEvent);
    events[eventIdx] = newEvent;
  } else {
    console.log("추가 :: ", newEvent);
    events.push(newEvent); // 새 이벤트 추가
  }
  timeline.setItems(events); // 타임라인에 업데이트된 이벤트 목록 반영
  modal.style.display = "none"; // 예약 후 모달 닫기
}

// 예약 데이터 테이블에 표시
function showData() {
  const tbody = document.getElementById("reservation-tbody");
  let html = "";

  for (let i = 0; i < events.length; i++) {
    const currentEvent = events[i];
    const groupName = getGroupNameById(currentEvent.group); // 그룹명(회의실명) 가져오기
    console.log(`${i} : ${JSON.stringify(currentEvent)}`);
    html += `<tr>
                <td>${currentEvent.id}</td>
                <td>${currentEvent.employee}</td>
                <td>${currentEvent.content}</td>
                <td>${formatDateToKor(currentEvent.start, true)}</td>
                <td>${formatDateToKor(currentEvent.end, true)}</td>
                <td>${groupName}</td>
              </tr>`;
  }

  tbody.innerHTML = html; // 테이블의 tbody에 HTML 추가
}

function prevDate() {
  changeDate(-1);
}
function nextDate() {
  changeDate(1);
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

// 시간을 설정하는 함수
function setTime(date, hours, minutes) {
  document.getElementById("today-text").innerText = formatDateToKor(today);
  return new Date(date.setHours(hours, minutes, 0, 0));
}

// withTime 이 true이면 시간까지 return
function formatDateToKor(date, withTime) {
  let text = `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일`;

  if (withTime) {
    text += ` ${date.getHours()}:${date.getMinutes()}`;
  }
  return text;
}
