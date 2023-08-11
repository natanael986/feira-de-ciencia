document.addEventListener("DOMContentLoaded", function () {
    const colorForm = document.getElementById("colorForm");
    const resultBox = document.getElementById("result");
    const btnMostrar = document.querySelector('input[type="submit"]');

    colorForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const colorInputs = colorForm.querySelectorAll('input[type="color"]');
        const selectedColors = Array.from(colorInputs).map(input => input.value);

        if (selectedColors.length === 3) {
            let resultColor = getResultColor(selectedColors);
            resultBox.innerHTML = `
                <div class="row">
                    <div class="col fs-1">
                        Resultado da mistura: <span style="color: ${resultColor};">${resultColor}</span>
                    </div>
                    <div style="background-color: ${resultColor}; width:100%; height:100px"></div>
                </div>
            `;
            saveToServer(selectedColors, resultColor);
            // Altera a cor de fundo do botão "Misturar"
            btnMostrar.style.backgroundColor = resultColor;
        } else {
            resultBox.innerHTML = "Escolha exatamente três cores para misturar.";
        }
    });

    function getResultColor(colors) {
        // Extrai os valores de cores RGB de cada cor escolhida
        const rgbValues = colors.map(color => hexToRgb(color));

        // Calcula a média dos valores R, G e B para cada cor
        const avgRgbValues = rgbValues.reduce((acc, cur) => {
            acc.r += cur.r;
            acc.g += cur.g;
            acc.b += cur.b;
            return acc;
        }, { r: 0, g: 0, b: 0 });

        avgRgbValues.r = Math.round(avgRgbValues.r / rgbValues.length);
        avgRgbValues.g = Math.round(avgRgbValues.g / rgbValues.length);
        avgRgbValues.b = Math.round(avgRgbValues.b / rgbValues.length);

        // Retorna a cor resultante em formato hexadecimal
        return rgbToHex(avgRgbValues.r, avgRgbValues.g, avgRgbValues.b);
    }

    function hexToRgb(hex) {
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b };
    }

    function rgbToHex(r, g, b) {
        return "#" + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase();
    }

    function saveToServer(selectedColors, resultColor) {
        const xhr = new XMLHttpRequest();
        const url = "save_records.php"; // Arquivo PHP para salvar registros

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    console.log("Registros salvos com sucesso!");
                } else {
                    console.error("Erro ao salvar registros.");
                }
            }
        };

        const data = "colors=" + encodeURIComponent(JSON.stringify(selectedColors)) + "&resultColor=" + encodeURIComponent(resultColor);
        xhr.send(data);
    }
});
