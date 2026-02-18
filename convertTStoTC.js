import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertTStoTC(inputDir, outputDir) {
  // Bersihkan folder output terlebih dahulu
  if (fs.existsSync(outputDir)) {
    console.log('🧹 Membersihkan folder output...');
    const existingFiles = fs.readdirSync(outputDir);
    existingFiles.forEach(file => {
      const filePath = path.join(outputDir, file);
      fs.unlinkSync(filePath);
      console.log(`   ✓ Menghapus: ${file}`);
    });
    console.log(`✅ Folder ${outputDir} berhasil dibersihkan\n`);
  }
  
  // Baca semua file di direktori input
  const files = fs.readdirSync(inputDir);
  
  // Filter hanya file TS_*.yml
  const tsFiles = files.filter(file => file.startsWith('TS_') && file.endsWith('.yml'));
  
  console.log(`📁 Ditemukan ${tsFiles.length} file TS untuk dikonversi`);
  
  tsFiles.forEach((tsFile, index) => {
    // Baca konten file TS
    const tsPath = path.join(inputDir, tsFile);
    const tsContent = fs.readFileSync(tsPath, 'utf8');
    
    // Parse steps dari file TS (simple parsing)
    const steps = parseYamlSteps(tsContent);
    
    // Buat nama file TC (ganti TS_ dengan TC_)
    const tcFileName = tsFile.replace('TS_', 'TC_');
    
    // Cek apakah ini file pertama atau terakhir
    const isFirstOrLast = index === 0 || index === tsFiles.length - 1;
    
    // Buat konten TC dengan format lengkap
    const tcContent = generateTCContent(steps, tcFileName, isFirstOrLast);
    
    // Tulis file TC
    const tcPath = path.join(outputDir, tcFileName);
    fs.writeFileSync(tcPath, tcContent, 'utf8');
    console.log(`   ✓ Berhasil membuat: ${tcFileName}`);
  });
  
  console.log(`\n🎉 Selesai! Total ${tsFiles.length} file TC telah dibuat di ${outputDir}`);
}

function parseYamlSteps(content) {
  const steps = [];
  const lines = content.split('\n');
  
  for (const line of lines) {
    if (line.trim().startsWith('label:')) {
      const label = line.split('label:')[1].trim();
      steps.push({ label });
    }
  }
  
  return steps;
}

function generateTCContent(steps, tcFileName, isFirstOrLast) {
  const tcName = tcFileName.replace('.yml', '');
  let runFlowSteps = '';
  let screenshotCounter = 1;
  
  for (let i = 0; i < steps.length; i += 2) {
    if (i >= steps.length) break;
    
    const step1 = steps[i];
    const step2 = steps[i + 1];
    
    runFlowSteps += `- runFlow:\n`;
    runFlowSteps += `    label: ${step1.label}\n`;
    runFlowSteps += `    commands:\n`;
    
    if (step2) {
      runFlowSteps += `      - runFlow:\n`;
      runFlowSteps += `          label: ${step2.label}\n`;
      runFlowSteps += `          commands:\n`;
      runFlowSteps += `            - waitForAnimationToEnd\n`;
      runFlowSteps += `            - takeScreenshot: \${output.PATH_FOLDER_REPORT}/${screenshotCounter.toString().padStart(2, '0')}_${tcName}\n`;
      screenshotCounter++;
    }
    
    // Tambahkan baris kosong antar step untuk readability
    if (i + 2 < steps.length) {
      runFlowSteps += `\n`;
    }
  }
  
  // Tentukan apakah get-balance.js di-comment atau tidak
  const balanceScript = isFirstOrLast 
    ? `  # - runScript:
  #     file: get-balance.js
  #     env:
  #       BALANCE_STATE: \${BALANCE_STATE}`
    : ``;
  
  return `appId: \${APP_ID}
env:
  PATH_FOLDER_REPORT: ./reports
onFlowStart:
  - runScript:
      file: ../../../../configs/onflowstart/onflowstart.js
      env:
        JIRA_ISSUE: \${JIRA_ISSUE}
${balanceScript}
onFlowComplete:
  - runScript: ../../../../configs/onflowend/onflowend.js

---

${runFlowSteps}`;
}

// Jalankan konversi
const inputDir = path.join(__dirname, '../../yml');
const outputDir = path.join(__dirname, '../../yml-tc');

// Buat direktori output jika belum ada
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

convertTStoTC(inputDir, outputDir);
