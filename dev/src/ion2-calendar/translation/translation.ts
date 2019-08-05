const translation: any = {
  en: {
    ChooseDate: 'Choose Date',
    StartDate: 'Start Date',
    ReturnDate: 'Return Date',
    ImTravellingOneWay: "I'm travelling one way",
    ImTravellingWithReturnTrip: "I'm travelling with return trips"
  },
  cn: {
    ChooseDate: '选择日期',
    StartDate: '开始日期',
    ReturnDate: '返程日期',
    ImTravellingOneWay: '我旅行的一种方式',
    ImTravellingWithReturnTrip: '我与回程旅行'
  },
  kh: {
    ChooseDate: 'ជ្រើសកាលបរិច្ឆេទ',
    StartDate: 'ថ្ងៃចេញដំណើរ',
    ReturnDate: 'ថ្ងៃត្រឡប់មក',
    ImTravellingOneWay: 'ជ្រើសរើស',
    ImTravellingWithReturnTrip: 'ជ្រើសរើស'
  }
};

const monthTranslation: any = {
  kh: ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'],
  cn: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  en: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
};
const Week: any = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  cn: ['日', '一', '二', '三', '四', '五', '六'],
  kh: ['អាទិ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហ', 'សុក្រ', 'សៅរ៏']
};

export { monthTranslation, translation, Week };
