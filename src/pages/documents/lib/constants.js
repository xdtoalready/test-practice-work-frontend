export const docTypes = {
  act: "act",
  bill: "bill",
};

export const docTypesRu = {
  act: "Акты",
  bill: "Счета",
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
