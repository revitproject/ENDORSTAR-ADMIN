// Modal
class ModalManager {
  constructor() {
    this.initModals();
  }

  initModals() {
    document.body.addEventListener('click', (e) => {
      const openTrigger = e.target.closest('[data-modal="open"]');
      const closeTrigger = e.target.closest('[data-modal="close"], .modal__close');

      if (openTrigger) {
        const modalId = openTrigger.getAttribute('data-url') || openTrigger.getAttribute('href');
        this.openModal(document.querySelector(modalId));
        e.preventDefault();
      } else if (closeTrigger) {
        this.closeModal(closeTrigger.closest('.modal'));
        e.preventDefault();
      }
    });
  }

  openModal(modal) {
    if (modal) {
      document.querySelectorAll('.modal.is-show').forEach(activeModal => {
        if (activeModal !== modal) {
          activeModal.classList.remove('is-show');
        }
      });
      modal.classList.add('is-show');
    }
  }

  closeModal(modal) {
    if (modal) {
      modal.classList.remove('is-show');
    }
  }
}

// Alert, Confirm
class CustomAlert {
  constructor() {
    this.alertContainer = document.querySelector('[data-modal="alert"]');
    if (!this.alertContainer) {
      // console.error('Alert modal container not found');
      return;
    }
    this.initAlert();
  }

  // 초기화 함수. 필요한 DOM 요소를 찾아 멤버 변수에 할당
  initAlert() {
    this.alertTitle = this.alertContainer.querySelector('.modal-title');
    this.alertText = this.alertContainer.querySelector('.modal-content .alert-msg');
    this.trueBtn = this.alertContainer.querySelector('.modal-footer .is-true');
    this.falseBtn = this.alertContainer.querySelector('.modal-footer .is-false');
  }

  /**
   * alert 표시
   * @param {string} title - alert 타이틀
   * @param {string} msg - alert 메시지
   * @param {function} trueFn - 확인 버튼 클릭 시 실행할 함수
   * @param {string} trueBtnText - 확인 버튼의 텍스트 (기본값: '확인')
   */
  alert(title, msg, trueFn, trueBtnText = '확인') {
    this.setupAlert(title, msg);
    this.trueBtn.textContent = trueBtnText;
    this.falseBtn.style.display = 'none';  // 취소 버튼 숨기기
    this.trueBtn.onclick = () => {
      if (trueFn) trueFn();
      this.hideAlert();
    };
    this.showAlert();
  }

  /**
   * confirm 표시
   * @param {string} title - confirm 타이틀
   * @param {string} msg - confirm 메시지
   * @param {function} trueFn - 확인 버튼 클릭 시 실행할 함수
   * @param {function} falseFn - 취소 버튼 클릭 시 실행할 함수
   * @param {string} trueBtnText - 확인 버튼의 텍스트 (기본값: '확인')
   * @param {string} falseBtnText - 취소 버튼의 텍스트 (기본값: '취소')
   */
  confirm(title, msg, trueFn, falseFn, trueBtnText = '확인', falseBtnText = '취소') {
    this.setupAlert(title, msg);
    this.trueBtn.textContent = trueBtnText;
    this.falseBtn.textContent = falseBtnText;
    this.trueBtn.onclick = () => {
      if (trueFn) trueFn();
      this.hideAlert();
    };
    this.falseBtn.onclick = () => {
      if (falseFn) falseFn();
      this.hideAlert();
    };
    this.falseBtn.style.display = 'block';  // 취소 버튼 표시
    this.showAlert();
  }

  setupAlert(title, msg) {
    this.alertTitle.textContent = title;
    this.alertText.innerHTML = msg;
  }

  showAlert() {
    this.alertContainer.classList.add('is-show');
  }

  hideAlert() {
    this.alertContainer.classList.remove('is-show');
  }
}

// Tab
class TabManager {
  constructor() {
    this.initTabs();
  }

  initTabs() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest(".tab-link");
      if (target && target.getAttribute("href") === "#") {
        e.preventDefault();
        this.handleTabClick(target);
      }
    });
  }

  handleTabClick(target) {
    const tabContentId = target.dataset.tab;
    const tabList = target.closest(".ui-tab");

    tabList.querySelectorAll(".tab-item").forEach(item => {
      item.classList.remove("is-active");
    });
    target.closest(".tab-item").classList.add("is-active");

    document.querySelectorAll(".tab-content").forEach(content => {
      // 상위 탭 콘텐츠에만 적용
      if (content.closest(".ui-tab") === tabList) {
        content.classList.remove("is-active");
        if (content.getAttribute("data-tab-content") === tabContentId) {
          content.classList.add("is-active");
        }
      }
    });

    // 탭 안의 탭 처리
    const nestedTabManager = new NestedTabManager(tabContentId);
    nestedTabManager.initTabs();
  }
}
class NestedTabManager {
  constructor(parentTabId) {
    this.parentTabId = parentTabId;
  }

  initTabs() {
    const parentTabContent = document.querySelector(`.tab-content[data-tab-content="${this.parentTabId}"]`);
    if (parentTabContent) {
      parentTabContent.querySelectorAll('.tab-link').forEach(link => {
        link.addEventListener('click', (e) => {
          const target = e.target.closest(".tab-link");
          if (target && target.getAttribute("href") === "#") {
            e.preventDefault();
            this.handleTabClick(target, parentTabContent);
          }
        });
      });
    }
  }

  handleTabClick(target, parentTabContent) {
    const tabContentId = target.dataset.tab;
    const tabList = target.closest(".ui-tab");

    tabList.querySelectorAll(".tab-item").forEach(item => {
      item.classList.remove("is-active");
    });
    target.closest(".tab-item").classList.add("is-active");

    parentTabContent.querySelectorAll(".tab-content").forEach(content => {
      content.classList.remove("is-active");
      if (content.getAttribute("data-tab-content") === tabContentId) {
        content.classList.add("is-active");
      }
    });
  }
}

// Grid (TOAST UI Grid)
class GridManager {
  constructor() {
    this.applyGridTheme();
  }

  applyGridTheme() {
    const gridStyle = {
      row: {
        hover: {
          background: "none"
        }
      },
      selection: {
        background: "transparent",
        border: "transparent",
      },
      scrollbar: {
        border: "transparent",
        background: "transparent",
        thumb: "#C6CBD0",
        emptySpace: "transparent",
        active: "#B3B3B3"
      },
      cell: {
        normal: {
          background: "#fff",
          border: "#CCCCCC",
          showVerticalBorder: false,
          text: "#666666"
        },
        header: {
          background: "#fff",
          border: "#CCCCCC",
          showVerticalBorder: false,
          showHorizontalBorder: true,
          text: "#111111"
        },
        selectedHeader: {
          background: "#E7E7E7",
          border: "#DDDDDD"
        },
        selectedRowHeader: {
          background: "#fff"
        },
        focused: {
          border: "transparent"
        },
        focusedInactive: {
          border: "transparent"
        },
        disabled: {
          background: "#F0F0F0",
          text: "#C0C0C0"
        },
        required: {
          background: "rgba(252, 136, 29,0.05)"
        },
        invalid: {
          background: "rgba(232, 105, 65,0.1)"
        }
      }
    };
    tui.Grid.applyTheme('default', gridStyle);
  }
}
// Grid 행번호 렌더러 커스텀
class RowNumberRenderer {
  constructor(props) {
    const el = document.createElement('span');
    el.innerHTML = `${props.formattedValue}`;
    this.el = el;
  }

  getElement() {
    return this.el;
  }

  render(props) {
    this.el.innerHTML = `${props.formattedValue}`;
  }
}
// Grid 체크박스 렌더러 커스텀
class CheckboxRenderer {
  constructor(props) {
    const { grid, rowKey } = props;

    const label = document.createElement('label');
    label.className = 'checkbox tui-grid-row-header-checkbox';
    label.setAttribute('for', String(rowKey));

    const hiddenInput = document.createElement('input');
    hiddenInput.className = 'hidden-input';
    hiddenInput.id = String(rowKey);

    const customInput = document.createElement('span');
    customInput.className = 'custom-input';

    label.appendChild(hiddenInput);
    label.appendChild(customInput);

    hiddenInput.type = 'checkbox';
    label.addEventListener('click', (ev) => {
      ev.preventDefault();

      if (ev.shiftKey) {
        grid[!hiddenInput.checked ? 'checkBetween' : 'uncheckBetween'](rowKey);
        return;
      }

      grid[!hiddenInput.checked ? 'check' : 'uncheck'](rowKey);
    });

    this.el = label;
    this.render(props);
  }

  getElement() {
    return this.el;
  }

  render(props) {
    const hiddenInput = this.el.querySelector('.hidden-input');
    const checked = Boolean(props.value);
    hiddenInput.checked = checked;
  }
}

// Dropdown
class DropdownManager {
  constructor(element) {
    this.dropdown = element;
    this.trigger = this.dropdown.querySelector('.dropdown-trigger');
    this.menu = this.dropdown.querySelector('.dropdown-menu');
    this.init();
  }

  init() {
    this.trigger.addEventListener('click', () => {
      this.dropdown.classList.toggle('open');
    });

    this.menu.addEventListener('click', event => {
      if (event.target.classList.contains('dropdown-item')) {
        this.selectItem(event.target);
      }
    });
  }

  selectItem(item) {
    this.menu.querySelectorAll('.dropdown-item').forEach(dropdownItem => {
      dropdownItem.classList.remove('selected');
    });
    item.classList.add('selected');
    this.trigger.textContent = item.textContent;
    this.dropdown.classList.remove('open');
  }
}

// 기타 유틸리티 함수
function activeDateOptions(selector) {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      buttons.forEach(btn => btn.classList.remove('is-active'));
      this.classList.add('is-active');
    });
  });
}

// 이미지 업로드 초기화 함수
function initPhotoRegistration(config) {
  const registerBtn = document.getElementById(config.registerBtnId); // 등록 버튼
  const thumbnailContainer = document.getElementById(config.thumbnailContainerId);
  
  if (!registerBtn || !thumbnailContainer) {
    console.error("Required elements not found. Please check the element IDs in the config.");
    return;
  }

  const maxPhotos = config.maxPhotos;
  const lengthSpan = registerBtn.querySelector(".length-txt");
  const currentCountSpan = registerBtn.querySelector(".current");
  const addIcon = registerBtn.querySelector(".ico-add");
  const validExtensions = config.validExtensions || ['jpg', 'jpeg', 'png']; // 허용 확장자
  const maxFileSizeMB = config.maxFileSizeMB; // 최대 파일 사이즈 100MB

  let photos = [];

  if (lengthSpan) lengthSpan.style.display = "none";

  registerBtn.addEventListener("click", handleRegisterClick);

  function handleRegisterClick() {
    if (photos.length < maxPhotos) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = validExtensions.map(ext => `image/${ext}`).join(',');
      input.onchange = handleFileChange;
      input.click();
    }
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      if (!isValidExtension(file.name)) {
        alert('지원하지 않는 파일 형식입니다.');
        return;
      }
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        alert('100MB 이하의 파일만 업로드 가능합니다.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        photos.push({ src: e.target.result, name: file.name });
        updateThumbnails();
        updatePhotoCount();
      };
      reader.readAsDataURL(file);
    }
  }

  function isValidExtension(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    return validExtensions.includes(extension);
  }

  function updateThumbnails() {
    thumbnailContainer.innerHTML = photos.map((photo, index) => `
      <div class="thumbnail">
        <img src="${photo.src}" alt="Thumbnail">
        <span class="file-name">${photo.name}</span>
        <button class="delete-btn" data-index="${index}"><span class="hidden">삭제</span></button>
      </div>
    `).join('');

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", handleDeleteButtonClick);
    });

    registerBtn.classList.toggle("disabled", photos.length >= maxPhotos);
  }

  function handleDeleteButtonClick(event) {
    const photoToDeleteIndex = event.target.getAttribute("data-index");
    handleDeletePhoto(photoToDeleteIndex);
  }

  function handleDeletePhoto(index) {
    photos.splice(index, 1);
    updateThumbnails();
    updatePhotoCount();
  }

  function updatePhotoCount() {
    if (currentCountSpan) currentCountSpan.textContent = photos.length;
    const hasPhotos = photos.length > 0;
    if (lengthSpan) lengthSpan.style.display = hasPhotos ? "inline" : "none";
    if (addIcon) addIcon.style.display = hasPhotos ? "none" : "inline";
  }

  // 초기 상태 설정
  updatePhotoCount();
}

// 이미지 보기 초기화 함수
function initPhotoView(config) {
  const thumbnailContainer = document.getElementById(config.thumbnailContainerId);
  const previewEnabled = config.previewEnabled || false;

  if (!thumbnailContainer) {
    console.error("Required elements not found. Please check the element ID in the config.");
    return;
  }

  let photos = config.photos || []; // 서버에서 받아온 사진 목록

  function updateThumbnails() {
    thumbnailContainer.innerHTML = photos.map((photo, index) => `
      <div class="thumbnail" data-index="${index}" style="position: relative;">
        <img src="${photo.src}" alt="Thumbnail" class="previewable">
        <span class="file-name">${photo.name}</span>
        <button class="delete-btn" data-index="${index}"><span class="hidden">삭제</span></button>
      </div>
    `).join('');

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", handleDeleteButtonClick);
    });

    if (previewEnabled) {
      document.querySelectorAll(".previewable").forEach(img => {
        img.addEventListener("mouseenter", handlePreviewMouseOver);
        img.addEventListener("mouseleave", handlePreviewMouseOut);
      });
    }
  }

  function handleDeleteButtonClick(event) {
    const photoToDeleteIndex = event.target.getAttribute("data-index");
    handleDeletePhoto(photoToDeleteIndex);
  }

  function handleDeletePhoto(index) {
    customAlert.confirm('사진 삭제 안내', '등록된 사진을 삭제할까요?', () => {
      photos.splice(index, 1);
      updateThumbnails();
    }, null, '삭제', '닫기');
  }

  function handlePreviewMouseOver(event) {
    const imgSrc = event.target.src;
    const imgRect = event.target.getBoundingClientRect();

    // 미리보기 모달 생성
    let previewModal = document.createElement('div');
    previewModal.classList.add('preview-modal');
    previewModal.style.position = 'absolute';
    previewModal.style.bottom = `${window.innerHeight - imgRect.top + 10}px`;
    previewModal.style.left = `${imgRect.left + window.scrollX}px`;

    const imgElement = document.createElement('img');
    imgElement.src = imgSrc;
    imgElement.style.maxWidth = '300px'; 
    imgElement.style.maxHeight = '300px'; 

    previewModal.appendChild(imgElement);
    document.body.appendChild(previewModal);
    previewModal.addEventListener('mouseleave', () => {
      previewModal.remove();
    });
  }

  function handlePreviewMouseOut(event) {
    const previewModal = document.querySelector('.preview-modal');
    if (previewModal) {
      previewModal.remove();
    }
  }

  // 초기 상태 설정
  updateThumbnails();
}

class ApplicationInit {
  constructor() {
    this.registerGlobalFunctions();
    document.addEventListener('DOMContentLoaded', () => {
      this.initComponents();
    });
  }

  registerGlobalFunctions() {
    window.trueFn = () => console.log("확인 로직 실행");
    window.falseFn = () => console.log("취소 로직 실행");
  }

  initComponents() {
    this.modalManager = new ModalManager();
    this.gridManager = new GridManager('.grid');
    this.tabManager = new TabManager();
    window.customAlert = new CustomAlert(); // 글로벌 객체에 할당

    this.dropdownManagers = Array.from(document.querySelectorAll('.ui-dropdown'))
      .map(dropdown => new DropdownManager(dropdown));

    activeDateOptions('.btn-options .btn');
  }
}

// 애플리케이션 초기화 실행
new ApplicationInit();