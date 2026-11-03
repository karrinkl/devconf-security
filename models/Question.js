const mongoose = require('mongoose');

/**
 * Вопрос зрителя спикеру. Поле text — вектор XSS из варианта 2.
 * В базу оно попадает уже после sanitizePlainText.
 */
const questionSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: [true, 'Имя обязательно'],
      trim: true,
      minlength: [2, 'Имя не короче 2 символов'],
      maxlength: [80, 'Имя не длиннее 80 символов'],
    },
    speakerName: {
      type: String,
      required: [true, 'Имя спикера обязательно'],
      trim: true,
      minlength: [2, 'Имя спикера не короче 2 символов'],
      maxlength: [120, 'Имя спикера не длиннее 120 символов'],
    },
    text: {
      type: String,
      required: [true, 'Текст вопроса обязателен'],
      trim: true,
      minlength: [5, 'Вопрос не короче 5 символов'],
      maxlength: [1000, 'Вопрос не длиннее 1000 символов'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model('Question', questionSchema);
