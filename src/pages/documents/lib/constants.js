export const docTypes = {
  act: "act",
  bill: "bill",
  report: "report",
};

export const docTypesRu = {
  act: "Акты",
  bill: "Счета",
  report: "Отчеты",
};


export const docStatusTypes = {
  created: 'created',
  paid: 'paid',
  canceled: 'canceled',
  expired: 'expired',
};

export const docStatusTypesRu = {
  created: 'Создан',
  paid: 'Оплачен',
  canceled: 'Отменен',
  expired: 'Просрочен',
};

export const colorDocStatusTypes = {
  created: { status: docStatusTypes.created, class: '_blue' },
  paid: { status: docStatusTypes.paid, class: '_green' },
  canceled: { status: docStatusTypes.canceled, class: '_grey' },
  expired: { status: docStatusTypes.expired, class: '_red' },
};

// Статусы отчетов
export const reportStatusTypes = {
  created: 'created',
  viewed: 'viewed',
  agreed: 'agreed',
};

export const reportStatusTypesRu = {
  created: 'Создан',
  viewed: 'Просмотрен',
  agreed: 'Согласован',
};

export const colorReportStatusTypes = {
  created: { status: reportStatusTypes.created, class: '_blue' },
  viewed: { status: reportStatusTypes.viewed, class: '_orange' },
  agreed: { status: reportStatusTypes.agreed, class: '_green' },
};

// Типы отчетов
export const reportTypes = {
  general: 'general',
  seo: 'seo',
};

export const reportTypesRu = {
  general: 'Общий',
  seo: 'SEO',
};
