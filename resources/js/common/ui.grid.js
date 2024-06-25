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

class ApplicationInit {
  constructor() {
    document.addEventListener('DOMContentLoaded', () => {
      this.initComponents();
    });
  }

  // iniit
  initComponents() {
    this.gridManager = new GridManager('.grid'); 
  }
}

// 애플리케이션 초기화
new ApplicationInit();
