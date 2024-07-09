document.addEventListener('DOMContentLoaded', function () {
  loadHeader();
  loadLnb(document.body.dataset.route);  
});

// 헤더 로드 함수
function loadHeader() {
  fetch('../common/header.html')
    .then(response => response.text())
    .then(html => {
      const header = document.querySelector('.base-header');
      if (header && !header.innerHTML.trim()) {
        header.innerHTML = html;
      }
    })
    .catch(error => console.error('Header 로드 실패:', error));
}

// LNB 로드 함수
function loadLnb(route) {
  fetch('../common/lnb.html')
    .then(response => response.text())
    .then(html => {
      const sideBar = document.querySelector('.base-aside');
      sideBar.innerHTML = html;
      initLnb(route); // LNB 메뉴 초기화 함수 호출
    })
    .catch(error => console.error('LNB 로드 실패:', error));
}

// LNB 메뉴 초기화 함수
function initLnb(route) {
  // 현재 경로와 일치하지 않는 모든 LNB 제거
  document.querySelectorAll(`.lnb:not(.${route})`).forEach(lnb => lnb.remove());

  // 올바른 LNB를 찾아 확장
  const activeLnb = document.querySelector(`.lnb.${route}`);
  if (activeLnb) {
    activeLnb.classList.add('is-open');
    addClickListenersToLnbItems(activeLnb, route); // 1depth 메뉴 클릭 리스너 추가
  }
}

// 1depth 클릭 이벤트 리스너 추가
function addClickListenersToLnbItems(lnbElement, route) {
  const depth1Selector = '.lnb-item > .lnb-link';
  const depth2Selector = '.lnb-sub .lnb-sub-link';
  const depth3Selector = '.lnb-sub .lnb-sub-link2';

  lnbElement.querySelectorAll(depth1Selector).forEach(item => {
    item.addEventListener('click', function (event) {
      const parent = item.closest('.lnb-item'); // 1depth
      const subMenu = parent.querySelector('.lnb-sub'); // 2depth

      // lnb.component - 기본 링크 이동 허용
      if (route === 'component') {
        return;
      }

      // lnb.main - 1depth 하위 메뉴가 모두 없으면 기본 링크 이동 허용
      if (route === 'main' && !subMenu) {
        return;
      }

      if (subMenu) {
        // 애니메이션이 진행 중인 동안 클릭 방지
        if (subMenu.classList.contains('animating')) {
          event.preventDefault();
          return;
        }

        // 하위 메뉴 토글 애니메이션
        toggleSubMenu(parent, subMenu);

        if (route === 'main') {
          // 다른 모든 열린 메뉴를 닫기
          closeOtherOpenMenus(lnbElement, parent);
        }
      } else {
        event.preventDefault();
        // 페이지 이동 처리
        const link = item.getAttribute('href');
        window.location.href = link;
      }
    });
  });

  // 하위 메뉴 링크에 대해 애니메이션 없이 바로 이동
  lnbElement.querySelectorAll(`${depth2Selector}, ${depth3Selector}`).forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); 
      const href = this.getAttribute('href');
      window.location.href = href; 
    });
  });
}

// 하위 메뉴 토글 애니메이션 함수
function toggleSubMenu(parent, subMenu) {
  if (!parent.classList.contains('is-open')) {
    const fullHeight = subMenu.scrollHeight + 'px';
    subMenu.style.height = fullHeight;
    parent.classList.add('is-open');
    subMenu.classList.add('animating');

    setTimeout(() => {
      subMenu.style.height = 'auto';
      subMenu.classList.remove('animating');
    }, 300); // 트랜지션 시간과 동일하게 설정
  } else {
    subMenu.style.height = subMenu.scrollHeight + 'px';
    subMenu.classList.add('animating');
    setTimeout(() => {
      subMenu.style.height = '0px';
      parent.classList.remove('is-open');
      subMenu.classList.remove('animating');
    }, 10);
  }
}

// 다른 모든 열린 메뉴를 닫는 함수
function closeOtherOpenMenus(lnbElement, parent) {
  lnbElement.querySelectorAll('.lnb-item.is-open').forEach(otherItem => {
    if (otherItem !== parent) {
      const otherSubMenu = otherItem.querySelector('.lnb-sub');
      if (otherSubMenu) {
        otherSubMenu.style.height = '0px';
        otherItem.classList.remove('is-open');
      }
    }
  });
}

/**
 * LNB 상태 활성화 함수
 * @param {number} depth1Index - 1depth 인덱스
 * @param {number|null} depth2Index - 2depth 인덱스, 없으면 null
 * @param {number|null} depth3Index - 3depth 인덱스, 없으면 null
 */
const lnbActive = function (depth1Index, depth2Index = null, depth3Index = null) {
  // LNB의 활성화 라우트 요소를 선택
  const activeLnb = document.querySelector('.lnb.' + document.body.dataset.route);
  if (!activeLnb) return;

  // 선택된 1depth 메뉴 아이템
  const depth1Item = activeLnb.children[depth1Index];
  if (!depth1Item) return;
  
  // 1depth 메뉴 활성화
  depth1Item.classList.add('is-active', 'is-open');

  // 2depth 메뉴가 있고 지정된 인덱스가 유효한 경우 활성화
  if (depth2Index !== null && depth1Item.querySelector('.lnb-subItem')) {
    const depth2Items = depth1Item.querySelectorAll('.lnb-subItem');
    const depth2Item = depth2Items[depth2Index];
    if (depth2Item) {
      depth2Item.classList.add('is-active');
      
      // 3depth 메뉴가 있고, 지정된 인덱스가 유효한 경우 활성화
      if (depth3Index !== null && depth2Item.querySelector('.lnb-sub.depth3 li')) {
        const depth3Items = depth2Item.querySelectorAll('.lnb-sub.depth3 li');
        const depth3Item = depth3Items[depth3Index];
        if (depth3Item) {
          depth3Item.classList.add('is-active');
        }
      }
    }
  }
};