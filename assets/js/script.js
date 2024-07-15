let chart;

async function convertirMoneda() {
  const monto = document.getElementById("monto").value;
  const moneda = document.getElementById("moneda").value;
  const resultadoDiv = document.getElementById("resultado");

  if (!moneda) {
    resultadoDiv.innerHTML = "Por favor, seleccione una moneda.";
    return;
  }

  try {
    const response = await fetch(`https://mindicador.cl/api/${moneda}`);
    if (!response.ok) throw new Error("Error en la consulta a la API");

    const data = await response.json();
    const valor = data.serie[0].valor;
    const conversion = monto / valor;

    let simboloMoneda;
    switch (moneda) {
      case "dolar":
        simboloMoneda = "$";
        break;
      case "euro":
        simboloMoneda = "€";
        break;
      default:
        simboloMoneda = "";
    }

    resultadoDiv.innerHTML = `Resultado: ${simboloMoneda}${conversion.toFixed(
      2
    )}`;

    mostrarHistorial(data.serie);
  } catch (error) {
    resultadoDiv.innerHTML = `Error: ${error.message}`;
  }
}

function mostrarHistorial(serie) {
  const ctx = document.getElementById("historialChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  const labels = serie
    .slice(0, 10)
    .map((entry) => new Date(entry.fecha).toLocaleDateString());
  const data = serie.slice(0, 10).map((entry) => entry.valor);

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.reverse(),
      datasets: [
        {
          label: "Historial de los últimos 10 días",
          data: data.reverse(),
          borderColor: "rgba(192, 192, 192, 1)",
          borderWidth: 2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: "silver",
          },
        },
        x: {
          ticks: {
            color: "silver",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "silver",
          },
        },
      },
    },
  });
}
