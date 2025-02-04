let jsPDFIsReady = false;

// Função para verificar se o jsPDF está pronto
function jsPDFReady() {
    jsPDFIsReady = true;
    const botaoSalvarPDF = document.getElementById('salvarPDF');
    if (botaoSalvarPDF) {
        botaoSalvarPDF.addEventListener('click', salvarPDF);
    } else {
        console.error("Botão Salvar PDF não encontrado.");
    }
}

// Função para calcular a idade a partir da data de nascimento
function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    // Ajusta a idade se o aniversário ainda não ocorreu este ano
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }

    return idade;
}

// Função para calcular os resultados
function calcular() {
    try {
        const nome = document.getElementById('nome').value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;
        const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);
        const pressaoSistolica = parseInt(document.getElementById('pressaoSistolica').value);
        const pressaoDiastolica = parseInt(document.getElementById('pressaoDiastolica').value);
        const glicemia = parseInt(document.getElementById('glicemia').value);
        const temperatura = parseFloat(document.getElementById('temperatura').value);

        if (!nome || !dataNascimento || !sexo || isNaN(peso) || isNaN(altura) || isNaN(pressaoSistolica) || isNaN(pressaoDiastolica) || isNaN(glicemia) || isNaN(temperatura)) {
            throw new Error("Por favor, preencha todos os campos corretamente.");
        }

        // Validar data de nascimento
        if (!isValidDate(dataNascimento)) {
            throw new Error("Data de nascimento inválida. Use o formato YYYY-MM-DD.");
        }

        // Validar valores numéricos positivos
        if (peso <= 0 || altura <= 0 || pressaoSistolica <= 0 || pressaoDiastolica <= 0 || glicemia <= 0 || temperatura <= 0) {
            throw new Error("Por favor, insira valores positivos para peso, altura, pressão, glicemia e temperatura.");
        }

        // Calcular a idade
        const idade = calcularIdade(dataNascimento);

        const imc = peso / (altura * altura);
        const classificacaoIMC = classificarIMC(imc);
        const classificacaoPressao = classificarPressao(pressaoSistolica, pressaoDiastolica);
        const classificacaoGlicemia = classificarGlicemia(glicemia);
        const classificacaoTemperatura = classificarTemperatura(temperatura);

        document.getElementById('resultado-imc').textContent = `IMC: ${imc.toFixed(2)} - ${classificacaoIMC}`;
        document.getElementById('resultado-pressao').textContent = `Pressão Arterial: ${classificacaoPressao}`;
        document.getElementById('resultado-glicemia').textContent = `Glicemia: ${classificacaoGlicemia}`;
        document.getElementById('resultado-temperatura').textContent = `Temperatura: ${classificacaoTemperatura}`;

        let diagnostico = `Paciente ${nome}, ${idade} anos, do sexo ${sexo}, nascido em ${formatarData(dataNascimento)}, `;
        diagnostico += `com ${classificacaoIMC.toLowerCase()}, `;
        diagnostico += `pressão arterial ${classificacaoPressao.toLowerCase()}, `;
        diagnostico += `glicemia ${classificacaoGlicemia.toLowerCase()} e `;
        diagnostico += `temperatura ${classificacaoTemperatura.toLowerCase()}.`;

        document.getElementById('diagnostico').textContent = diagnostico;
    } catch (error) {
        alert(error.message);
    }
}

// Função para classificar o IMC
function classificarIMC(imc) {
    if (imc < 18.5) return "Abaixo do Peso";
    if (imc < 25) return "Peso Normal";
    if (imc < 30) return "Sobrepeso";
    if (imc < 35) return "Obesidade Grau I";
    if (imc < 40) return "Obesidade Grau II";
    return "Obesidade Grau III";
}

// Função para classificar a pressão arterial
function classificarPressao(sistolica, diastolica) {
    if (sistolica < 120 && diastolica < 80) return "Ótima";
    if (sistolica < 130 && diastolica < 85) return "Normal";
    if ((sistolica >= 130 && sistolica <= 139) || (diastolica >= 85 && diastolica <= 89)) return "Limítrofe";
    if ((sistolica >= 140 && sistolica <= 159) || (diastolica >= 90 && diastolica <= 99)) return "Hipertensão Estágio 1";
    if ((sistolica >= 160 && sistolica <= 179) || (diastolica >= 100 && diastolica <= 109)) return "Hipertensão Estágio 2";
    if (sistolica >= 180 || diastolica >= 110) return "Hipertensão Estágio 3";
    return "Indefinida";
}

// Função para classificar a glicemia
function classificarGlicemia(glicemia) {
    if (glicemia >= 70 && glicemia <= 99) return "Normal";
    if (glicemia >= 100 && glicemia <= 125) return "Pré-diabetes";
    if (glicemia >= 126) return "Diabetes";
    return "Hipotensão";
}

// Função para classificar a temperatura
function classificarTemperatura(temperatura) {
    if (temperatura < 36) return "Hipotermia";
    if (temperatura <= 37.5) return "Normal";
    return "Febre";
}

// Função para formatar a data
function formatarData(data) {
    const partes = data.split('-');
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para validar a data
function isValidDate(dateString) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const parts = dateString.split('-');
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    if (month < 1 || month > 12 || day < 1 || day > 31) return false;

    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// Função para salvar o PDF
function salvarPDF() {
    try {
        if (!jsPDFIsReady) {
            throw new Error("A biblioteca jsPDF ainda não foi carregada.");
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const nome = document.getElementById('nome').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
        const imc = document.getElementById('resultado-imc').textContent;
        const pressao = document.getElementById('resultado-pressao').textContent;
        const glicemia = document.getElementById('resultado-glicemia').textContent;
        const temperatura = document.getElementById('resultado-temperatura').textContent;
        const diagnostico = document.getElementById('diagnostico').textContent;

        doc.setFontSize(18);
        doc.text("Prontuário Digital do Paciente", 14, 20);

        doc.setFontSize(12);
        doc.text(`Nome: ${nome}`, 14, 35);
        doc.text(`Data de Nascimento: ${formatarData(dataNascimento)}`, 14, 45);
        doc.text(`Sexo: ${sexo}`, 14, 55);

        doc.text(imc, 14, 70);
        doc.text(pressao, 14, 80);
        doc.text(glicemia, 14, 90);
        doc.text(temperatura, 14, 100);

        doc.setFontSize(14);
        doc.text("Diagnóstico:", 14, 115);
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(diagnostico, 180);
        doc.text(textLines, 14, 125);

        doc.save("prontuario_paciente.pdf");
    } catch (error) {
        alert("Erro ao gerar o PDF: " + error.message);
    }
}

// Garante que o jsPDF está pronto após o carregamento da página
window.onload = jsPDFReady;
function calcular() {
    try {
        const nome = document.getElementById('nome').value.trim();
        const dataNascimento = document.getElementById('dataNascimento').value;
        const sexo = document.querySelector('input[name="sexo"]:checked')?.value;
        const peso = parseFloat(document.getElementById('peso').value);
        const altura = parseFloat(document.getElementById('altura').value);
        const pressaoSistolica = parseInt(document.getElementById('pressaoSistolica').value);
        const pressaoDiastolica = parseInt(document.getElementById('pressaoDiastolica').value);
        const glicemia = parseInt(document.getElementById('glicemia').value);
        const temperatura = parseFloat(document.getElementById('temperatura').value);
        const unidadeSaude = document.getElementById('unidadeSaude').value.trim();

        if (!nome || !dataNascimento || !sexo || isNaN(peso) || isNaN(altura) || isNaN(pressaoSistolica) || isNaN(pressaoDiastolica) || isNaN(glicemia) || isNaN(temperatura) || !unidadeSaude) {
            throw new Error("Por favor, preencha todos os campos corretamente.");
        }

        // Validar data de nascimento
        if (!isValidDate(dataNascimento)) {
            throw new Error("Data de nascimento inválida. Use o formato YYYY-MM-DD.");
        }

        // Validar valores numéricos positivos
        if (peso <= 0 || altura <= 0 || pressaoSistolica <= 0 || pressaoDiastolica <= 0 || glicemia <= 0 || temperatura <= 0) {
            throw new Error("Por favor, insira valores positivos para peso, altura, pressão, glicemia e temperatura.");
        }

        // Calcular a idade
        const idade = calcularIdade(dataNascimento);

        // Obter a data e hora atual
        const dataAtual = new Date();
        const dataFormatada = dataAtual.toLocaleDateString('pt-BR');
        const horaFormatada = dataAtual.toLocaleTimeString('pt-BR');

        const imc = peso / (altura * altura);
        const classificacaoIMC = classificarIMC(imc);
        const classificacaoPressao = classificarPressao(pressaoSistolica, pressaoDiastolica);
        const classificacaoGlicemia = classificarGlicemia(glicemia);
        const classificacaoTemperatura = classificarTemperatura(temperatura);

        document.getElementById('resultado-imc').textContent = `IMC: ${imc.toFixed(2)} - ${classificacaoIMC}`;
        document.getElementById('resultado-pressao').textContent = `Pressão Arterial: ${classificacaoPressao}`;
        document.getElementById('resultado-glicemia').textContent = `Glicemia: ${classificacaoGlicemia}`;
        document.getElementById('resultado-temperatura').textContent = `Temperatura: ${classificacaoTemperatura}`;

        let diagnostico = `Paciente ${nome}, ${idade} anos, do sexo ${sexo}, nascido em ${formatarData(dataNascimento)}, `;
        diagnostico += `com ${classificacaoIMC.toLowerCase()}, `;
        diagnostico += `pressão arterial ${classificacaoPressao.toLowerCase()}, `;
        diagnostico += `glicemia ${classificacaoGlicemia.toLowerCase()} e `;
        diagnostico += `temperatura ${classificacaoTemperatura.toLowerCase()}.`;

        document.getElementById('diagnostico').textContent = diagnostico;

        // Salvar dados para o PDF
        window.dadosPDF = {
            nome,
            dataNascimento: formatarData(dataNascimento),
            sexo,
            imc: `IMC: ${imc.toFixed(2)} - ${classificacaoIMC}`,
            pressao: `Pressão Arterial: ${classificacaoPressao}`,
            glicemia: `Glicemia: ${classificacaoGlicemia}`,
            temperatura: `Temperatura: ${classificacaoTemperatura}`,
            diagnostico,
            unidadeSaude,
            dataAtendimento: dataFormatada,
            horaAtendimento: horaFormatada
        };
    } catch (error) {
        alert(error.message);
    }
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
        doc.text(`Data do Atendimento: ${dados.dataAtendimento}`, 14, 40);
        doc.text(`Hora do Atendimento: ${dados.horaAtendimento}`, 14, 50);

        doc.text(`Nome: ${dados.nome}`, 14, 65);
        doc.text(`Data de Nascimento: ${dados.dataNascimento}`, 14, 75);
        doc.text(`Sexo: ${dados.sexo}`, 14, 85);

        doc.text(dados.imc, 14, 100);
        doc.text(dados.pressao, 14, 110);
        doc.text(dados.glicemia, 14, 120);
        doc.text(dados.temperatura, 14, 130);

        doc.setFontSize(14);
        doc.text("Diagnóstico:", 14, 145);
        doc.setFontSize(12);
        const textLines = doc.splitTextToSize(dados.diagnostico, 180);
        doc.text(textLines, 14, 155);

        doc.save("prontuario_paciente.pdf");
    } catch (error) {
        alert("Erro ao gerar o PDF: " + error.message);
    }
}