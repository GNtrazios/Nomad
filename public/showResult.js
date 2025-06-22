document.addEventListener('DOMContentLoaded', async () => {
    await loadCocktailData();
    await loadQuestionStats();
  });
  
  async function loadCocktailData() {
    const response = await fetch('/api/getCocktailPopularity');
    const data = await response.json();
    const tableBody = document.querySelector('#cocktailTable tbody');
  
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.cocktail}</td>
        <td>${item.popularity}</td>
        <td>${item.popularitypercentage}%</td>
      `;
      tableBody.appendChild(row);
    });
  }
  
  async function loadQuestionStats() {
    const response = await fetch('/api/getQuestionStats');
    const data = await response.json();
    const tableBody = document.querySelector('#questionTable tbody');
  
    data.forEach(item => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${item.question}</td>
        <td>${item.answer}</td>
        <td>${item.clicks}</td>
        <td>${item.percentage_of_question_clicks}%</td>
      `;
      tableBody.appendChild(row);
    });
  }