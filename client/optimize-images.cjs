// client/optimize-images.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

const inputDir = path.join(__dirname, 'public', 'images');
const outputDir = path.join(__dirname, 'public', 'images', 'optimized');

/**
 * Создает директорию если она не существует
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Оптимизирует изображение с помощью Sharp и Imagemin
 */
async function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();

  try {
    // Сначала оптимизируем с помощью Sharp
    let sharpInstance = sharp(inputPath);

    // Получаем метаданные для определения типа
    const metadata = await sharpInstance.metadata();

    // Ресайзим если изображение слишком большое (макс 1920px по ширине)
    if (metadata.width > 1920) {
      sharpInstance = sharpInstance.resize(1920, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Конвертируем в WebP для лучшей производительности
    const webpPath = outputPath.replace(ext, '.webp');
    await sharpInstance
      .webp({ quality: 85 })
      .toFile(webpPath);

    console.log(`✅ Оптимизировано: ${path.basename(inputPath)} -> ${path.basename(webpPath)}`);

    // Также создаем оптимизированную версию в оригинальном формате
    if (ext === '.jpg' || ext === '.jpeg') {
      await imagemin([inputPath], {
        destination: path.dirname(outputPath),
        plugins: [
          imageminMozjpeg({
            quality: 85,
            progressive: true
          })
        ]
      });
    } else if (ext === '.png') {
      await imagemin([inputPath], {
        destination: path.dirname(outputPath),
        plugins: [
          imageminPngquant({
            quality: [0.6, 0.8]
          })
        ]
      });
    }

    console.log(`✅ Сжато: ${path.basename(inputPath)}`);

  } catch (error) {
    console.error(`❌ Ошибка обработки ${inputPath}:`, error.message);
  }
}

/**
 * Обрабатывает все изображения в директории
 */
async function processImages() {
  try {
    ensureDirectoryExists(outputDir);

    const files = fs.readdirSync(inputDir);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('ℹ️  Изображения для оптимизации не найдены');
      return;
    }

    console.log(`🔍 Найдено ${imageFiles.length} изображений для оптимизации`);

    for (const file of imageFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);
      await optimizeImage(inputPath, outputPath);
    }

    console.log('\n🎉 Оптимизация изображений завершена!');
    console.log(`📁 Оптимизированные изображения сохранены в: ${outputDir}`);

  } catch (error) {
    console.error('❌ Ошибка при обработке изображений:', error.message);
  }
}

// Запуск оптимизации
processImages();