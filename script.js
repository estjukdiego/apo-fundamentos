let educationCount = 1;
let experienceCount = 1;

function addEducation() {
    educationCount++;
    const educationSection = document.getElementById('education-section');
    const newEducation = document.createElement('div');
    newEducation.className = 'input-group';
    newEducation.innerHTML = `
        <label for="education-${educationCount}">Instituição e Curso</label>
        <input type="text" id="education-${educationCount}" name="education[]">
    `;
    educationSection.appendChild(newEducation);
}

function addExperience() {
    experienceCount++;
    const experienceSection = document.getElementById('experience-section');
    const newExperience = document.createElement('div');
    newExperience.className = 'input-group';
    newExperience.innerHTML = `
        <label for="experience-${experienceCount}">Empresa e Cargo</label>
        <input type="text" id="experience-${experienceCount}" name="experience[]">
        <label for="experience-desc-${experienceCount}">Descrição das Atividades</label>
        <textarea id="experience-desc-${experienceCount}" name="experience-desc[]"></textarea>
    `;
    experienceSection.appendChild(newExperience);
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Informações Pessoais
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const sex = document.getElementById('sex').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const photo = document.getElementById('photo').files[0];

    doc.setFontSize(16);
    doc.setFont(undefined, 'bold'); // Título em negrito
    doc.setTextColor('#2c3e50'); // Cor azul marinho
    doc.text('Currículo', 15, 20);
    doc.setFont(undefined, 'normal'); // Volta ao texto normal
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold'); // Informações Pessoais em negrito
    doc.setTextColor('#2c3e50'); // Cor azul marinho
    doc.text('Informações Pessoais', 15, 30);
    doc.setFont(undefined, 'normal'); // Volta ao texto normal
    doc.setTextColor('#000000'); // Volta à cor preta padrão
    doc.setLineWidth(0.5); // Define a largura da linha separadora
    doc.setDrawColor('#2c3e50'); // Cor da linha azul marinho
    doc.line(15, 32, 120, 32); // Linha horizontal abaixo do título

    doc.text(`Nome: ${name}`, 20, 40);
    doc.text(`Idade: ${age}`, 20, 50);
    doc.text(`Sexo: ${sex}`, 20, 60);
    doc.text(`Telefone: ${phone}`, 20, 70);
    doc.text(`Email: ${email}`, 20, 80);
    doc.text(`Endereço: ${address}`, 20, 90);

    // Adicionar foto
    if (photo) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imgData = event.target.result;
            doc.addImage(imgData, 'JPEG', 150, 30, 40, 40);
            addEducationAndExperienceToPDF(doc, 110); // Ajuste a posição inicial para a formação e experiência após a foto ser carregada
        };
        reader.readAsDataURL(photo);
    } else {
        addEducationAndExperienceToPDF(doc, 110); // Posição inicial se não houver foto
    }
}

function addEducationAndExperienceToPDF(doc, startY) {
    // Formação
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold'); // Título em negrito
    doc.setTextColor('#2c3e50'); // Cor azul marinho
    doc.text('Formação', 15, startY);
    doc.setFont(undefined, 'normal'); // Volta ao texto normal
    doc.setTextColor('#000000'); // Volta à cor preta padrão
    doc.setLineWidth(0.5); // Define a largura da linha separadora
    doc.setDrawColor('#2c3e50'); // Cor da linha azul marinho
    doc.line(15, startY + 2, 80, startY + 2); // Linha horizontal abaixo do título
    let educationY = startY + 10;
    doc.setFontSize(12);
    const educations = document.getElementsByName('education[]');
    educations.forEach((education, index) => {
        if (education.value.trim() !== '') {
            doc.text(`${index + 1}. ${education.value}`, 20, educationY);
            educationY += 10;
        }
    });

    // Experiências Profissionais
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold'); // Título em negrito
    doc.setTextColor('#2c3e50'); // Cor azul marinho
    doc.text('Experiências Profissionais', 15, educationY + 10);
    doc.setFont(undefined, 'normal'); // Volta ao texto normal
    doc.setTextColor('#000000'); // Volta à cor preta padrão
    doc.setLineWidth(0.5); // Define a largura da linha separadora
    doc.setDrawColor('#2c3e50'); // Cor da linha azul marinho
    doc.line(15, educationY + 12, 170, educationY + 12); // Linha horizontal abaixo do título
    let experienceY = educationY + 20;
    doc.setFontSize(12);
    const experiences = document.getElementsByName('experience[]');
    const experiencesDesc = document.getElementsByName('experience-desc[]');
    experiences.forEach((experience, index) => {
        if (experience.value.trim() !== '') {
            doc.setFont(undefined, 'bold'); // Texto em negrito
            doc.text(`${index + 1}. Empresa e Cargo: ${experience.value}`, 20, experienceY);
            doc.setFont(undefined, 'normal'); // Volta ao texto normal
            experienceY += 10;
            if (experiencesDesc[index].value.trim() !== '') {
                doc.text(`Descrição: ${experiencesDesc[index].value}`, 20, experienceY);
                experienceY += 10;
            }
        }
    });

    // Salva o PDF
    doc.save('curriculo.pdf');  
}
