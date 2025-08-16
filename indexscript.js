/* ===== 既存のMatrixエフェクトコード ===== */
const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()*&^%";
const fontSize = 16;
const columns = canvas.width / fontSize;

const drops = [];
for (let x = 0; x < columns; x++)
  drops[x] = 1;

function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = letters.charAt(Math.floor(Math.random() * letters.length));

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "#00ffff");
    gradient.addColorStop(0.5, "#ff00ff");
    gradient.addColorStop(1, "#00ffff");
    ctx.fillStyle = gradient;

    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
      drops[i] = 0;

    drops[i]++;
  }
}

setInterval(draw, 33);

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

/* ===== ここからテーブル操作のための新機能コードを追加 ===== */

// DOMが完全に読み込まれてからスクリプトを実行する
document.addEventListener('DOMContentLoaded', () => {

  const searchInput = document.querySelector('.search-area input');
  const tableBody = document.querySelector('table tbody');
  const headers = document.querySelectorAll('table thead th');

  // 1. 検索による絞り込み機能
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
      const rowText = row.textContent.toLowerCase();
      // 行のテキストに検索語が含まれていれば表示、そうでなければ非表示
      if (rowText.includes(searchTerm)) {
        row.style.display = ''; // 表示
      } else {
        row.style.display = 'none'; // 非表示
      }
    });
  });

  // 2. 並び替え機能
  headers.forEach((header, index) => {
    header.addEventListener('click', () => {
      // 現在のソート方向を取得 (data属性を利用)
      const isAscending = header.classList.contains('sort-asc');
      const sortDirection = isAscending ? 'desc' : 'asc';

      // すべてのヘッダーからソートクラスを削除
      headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
      
      // クリックされたヘッダーに新しいソートクラスを追加
      header.classList.add(`sort-${sortDirection}`);

      // テーブルの行を配列に変換
      const rows = Array.from(tableBody.querySelectorAll('tr'));

      // 行をソート
      rows.sort((a, b) => {
        const valA = a.querySelectorAll('td')[index].textContent.trim();
        const valB = b.querySelectorAll('td')[index].textContent.trim();

        // localeCompareで文字列を比較（数字も正しく扱える場合が多い）
        if (sortDirection === 'asc') {
          return valA.localeCompare(valB, undefined, { numeric: true });
        } else {
          return valB.localeCompare(valA, undefined, { numeric: true });
        }
      });

      // ソート後の行をテーブルに戻す
      // 一旦tbodyの中身を空にする
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
      }
      // ソート済みの行を追加し直す
      tableBody.append(...rows);
    });
  });
});