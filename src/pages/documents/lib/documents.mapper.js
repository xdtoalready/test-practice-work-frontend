// documents.mapper.js
import { formatCurrency } from "../../../core/lib/utils";
import {
  colorDocStatusTypes,
  docStatusTypesRu,
  colorReportStatusTypes,
  reportStatusTypesRu,
  reportTypesRu
} from "./constants";

export const mapDocumentsFromApi = (apiDocs) => {
  return apiDocs.map((doc) => {
    // Используем тип из API, если он есть, иначе определяем по другим признакам
    let type =
      doc.type === "Bill"
        ? "Счет"
        : doc.type === "Act"
          ? "Акт"
          : doc.type === "Report"
            ? "Отчет"
            : "Документ";

    const formatDate = (dateString) => {
      if (!dateString) return "";
      const [year, month, day] = dateString.split("-");
      return `${day}.${month}.${year}`;
    };

    // Для отчетов используем другую структуру данных
    if (doc.type === "Report") {
      return {
        id: doc.data.id,
        type: type,
        date: formatDate(doc.data.creation_date),
        number: doc.data.id || "без номера",
        reportType: doc.data.type ? reportTypesRu[doc.data.type] : "Не указано",
        status: doc.data.status ? reportStatusTypesRu[doc.data.status] : 'Не указано',
        link: doc.data?.view,
        className: doc.data.status ? colorReportStatusTypes[doc.data.status].class : '_grey',
      };
    }

    // Для счетов и актов используем старую структуру
    return {
      id: doc.data.id,
      type: type,
      date: formatDate(doc.data.creation_date || doc.data.payment_date),
      number: doc.data.number || "без номера",
      sum: doc.data?.sum ? formatCurrency(doc.data?.sum) : "Не указано",
      status: doc.data.status ? docStatusTypesRu[doc.data.status] : 'Не указано',
      link:
        doc.data?.stamped_act ??
        doc.data?.unstamped_act ??
        doc.data?.stamped_bill ??
        doc.data?.unstamped_bill,
      className: doc.data.status ? colorDocStatusTypes[doc.data.status].class : '_grey',
    };
  });
};
