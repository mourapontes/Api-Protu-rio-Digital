let jsPDFIsReady = false;

function jsPDFReady() {
    jsPDFIsReady = true;
    const botaoSalvarPDF = document.getElementById('salvarPDF');
    if (botaoSalvarPDF) {
        botaoSalvarPDF.addEventListener('click', salvarPDF);
    } else {
        console.error("Botão Salvar PDF não encontrado.");
    }
}

function calcular() {
    try {
        const nome = document.getElementById('nome').value.trim();
        const idade = parseInt(document.getElementById('idade').value);
        const sexo = document.querySelector('input[name="sexo"]:checked')?.value || "Dados não definidos";
        const peso = parseFloat(document.getElementById('peso').value) || "Dados não definidos";
        const altura = parseFloat(document.getElementById('altura').value) || "Dados não definidos";
        const pressaoSistolica = parseInt(document.getElementById('pressaoSistolica').value) || "Dados não definidos";
        const pressaoDiastolica = parseInt(document.getElementById('pressaoDiastolica').value) || "Dados não definidos";
        const glicemia = parseInt(document.getElementById('glicemia').value) || "Dados não definidos";
        const temperatura = parseFloat(document.getElementById('temperatura').value) || "Dados não definidos";
        const unidadeSaude = document.getElementById('unidadeSaude').value.trim();
        const cidade = document.getElementById('cidade').value.trim() || "Dados não definidos";
        const estado = document.getElementById('estado').value.trim() || "Dados não definidos";

        // Validação dos campos obrigatórios
        if (!nome || isNaN(idade) || !unidadeSaude) {
            throw new Error("Por favor, preencha os campos obrigatórios: Nome, Idade e Unidade de Saúde.");
        }

        // Captura a data e hora atual
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
        const horaFormatada = dataAtual.toLocaleTimeString('pt-BR');

        // Cálculo do IMC (se peso e altura forem fornecidos)
        let imc = "Dados não definidos";
        let classificacaoIMC = "Dados não definidos";
        if (typeof peso === "number" && typeof altura === "number" && altura > 0) {
            imc = (peso / (altura * altura)).toFixed(2);
            classificacaoIMC = classificarIMC(imc);
        }

        // Classificações (se dados forem fornecidos)
        const classificacaoPressao = (typeof pressaoSistolica === "number" && typeof pressaoDiastolica === "number")
            ? classificarPressao(pressaoSistolica, pressaoDiastolica)
            : "Dados não definidos";

        const classificacaoGlicemia = (typeof glicemia === "number")
            ? classificarGlicemia(glicemia)
            : "Dados não definidos";

        const classificacaoTemperatura = (typeof temperatura === "number")
            ? classificarTemperatura(temperatura)
            : "Dados não definidos";

        // Exibe os resultados na tela
        document.getElementById('resultado-imc').textContent = `IMC: ${imc} - ${classificacaoIMC}`;
        document.getElementById('resultado-pressao').textContent = `Pressão Arterial: ${classificacaoPressao}`;
        document.getElementById('resultado-glicemia').textContent = `Glicemia: ${classificacaoGlicemia}`;
        document.getElementById('resultado-temperatura').textContent = `Temperatura: ${classificacaoTemperatura}`;

        // Monta o diagnóstico
        let diagnostico = `Paciente ${nome}, ${idade} anos, do sexo ${sexo}, `;
        diagnostico += `com ${classificacaoIMC.toLowerCase()}, `;
        diagnostico += `pressão arterial ${classificacaoPressao.toLowerCase()}, `;
        diagnostico += `glicemia ${classificacaoGlicemia.toLowerCase()} e `;
        diagnostico += `temperatura ${classificacaoTemperatura.toLowerCase()}.`;

        document.getElementById('diagnostico').textContent = diagnostico;

        // Salva os dados para o PDF
        window.dadosPDF = {
            nome,
            idade,
            sexo,
            imc: `IMC: ${imc} - ${classificacaoIMC}`,
            pressao: `Pressão Arterial: ${classificacaoPressao}`,
            glicemia: `Glicemia: ${classificacaoGlicemia}`,
            temperatura: `Temperatura: ${classificacaoTemperatura}`,
            diagnostico,
            unidadeSaude,
            cidade,
            estado,
            dataAtendimento: dataFormatada,
            horaAtendimento: horaFormatada
        };
    } catch (error) {
        alert(error.message);
    }
}

function classificarIMC(imc) {
    if (imc < 18.5) return "Abaixo do Peso";
    if (imc < 25) return "Peso Normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade Grau I";
    if (imc < 40) return "Obesidade Grau II";
    return "Obesidade Grau III";
}

function classificarPressao(sistolica, diastolica) {
    if (sistolica < 120 && diastolica < 80) return "Ótima";
    if (sistolica < 130 && diastolica < 85) return "Normal";
    if ((sistolica >= 130 && sistolica <= 139) || (diastolica >= 85 && diastolica <= 89)) return "Limítrofe";
    if ((sistolica >= 140 && sistolica <= 159) || (diastolica >= 90 && diastolica <= 99)) return "Hipertensão Estágio 1";
    if ((sistolica >= 160 && sistolica <= 179) || (diastolica >= 100 && diastolica <= 109)) return "Hipertensão Estágio 2";
    if (sistolica >= 180 || diastolica >= 110) return "Hipertensão Estágio 3";
    return "Indefinida";
}

function classificarGlicemia(glicemia) {
    if (glicemia >= 70 && glicemia <= 99) return "Normal";
    if (glicemia >= 100 && glicemia <= 125) return "Pré-diabetes";
    if (glicemia >= 126) return "Diabetes";
    return "Hipotensão";
}

function classificarTemperatura(temperatura) {
    if (temperatura < 36) return "Hipotermia";
    if (temperatura <= 37.5) return "Normal";
    return "Febre";
}

function salvarPDF() {
    try {
        if (!jsPDFIsReady) {
            throw new Error("A biblioteca jsPDF ainda não foi carregada.");
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const dados = window.dadosPDF;

        doc.setFontSize(18);
        doc.text("Prontuário Digital do Paciente", 14, 20);

        doc.setFontSize(12);
        doc.text(`Unidade de Saúde: ${dados.unidadeSaude}`, 14, 30);
        doc.text(`Cidade: ${dados.cidade}`, 14, 40);
        doc.text(`Estado: ${dados.estado}`, 14, 50);
        doc.text(`Data do Atendimento: ${dados.dataAtendimento}`, 14, 60);
        doc.text(`Hora do Atendimento: ${dados.horaAtendimento}`, 14, 70);

        doc.text(`Nome: ${dados.nome}`, 14, 85);
        doc.text(`Idade: ${dados.idade} anos`, 14, 95);
        doc.text(`Sexo: ${dados.sexo}`, 14, 105);

        doc.text(dados.imc, 14, 120);
        doc.text(dados.pressao, 14, 130);
        doc.text(dados.glicemia, 14, 140);
        doc.text(dados.temperatura, 14, 150);

        doc.setFontSize(14);
        doc.text("Diagnóstico:", 14, 165);
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(dados.diagnostico, 180);
        doc.text(textLines, 14, 175);

        doc.save("prontuario_paciente.pdf");
    } catch (error) {
        alert("Erro ao gerar o PDF: " + error.message);
    }
}

window.onload = jsPDFReady;
