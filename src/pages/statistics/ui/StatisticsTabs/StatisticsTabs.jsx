import React from "react";
import { StatCard } from "../../widgets/StatCard";
import { Chart } from "../../../../shared/ui/chart";
import { Select } from "../../../../shared/ui/select";
import LockedCard from "../../../../widgets/common/ui/LockedCard";
import { serviceHasMetricsData } from "../../../../core/lib/utils";

export const StatisticsTabs = ({
  visits,
  rejections,
  goals,
  visitsLoading,
  rejectionsLoading,
  goalsLoading,
  graphType,
  selectedConversion,
  onConversionChange,
  serviceType,
}) => {
  const enableVisitsCard = serviceHasMetricsData(serviceType);
  const enableRejectionsCard = serviceHasMetricsData(serviceType);
  const enableGoalsCard = true;

  return (
    <div className="page__col graphs__container">
      {/* Visits Card */}
      <StatCard
        title={visits?.header ?? 'Визиты'}
        value={enableVisitsCard ? visits?.value || "-" : null}
        change={visits?.change}
        comparedTo={visits?.comparedTo}
        infoTitle="Визиты из поисковых систем"
        infoDescription="Этот график показывает общее количество визитов из поисковых систем. Эти данные помогают отслеживать эффективность поисковой оптимизации и понимать, как меняется поисковый трафик с течением времени."
      >
        {enableVisitsCard ? (
          <Chart
            withDynamic={false}
            id="search-visits"
            type={graphType}
            series={visits?.series}
            categories={visits?.categories}
            isLoading={visitsLoading}
          />
        ) : (
          <LockedCard label={"Подключить VisitsTracking"} />
        )}
      </StatCard>

      {/* Rejections Card */}
      <StatCard
          title={rejections?.header ?? 'Отказы'}
        value={enableRejectionsCard ? (rejections?.value ?? "--") + "%" : null}
        change={rejections?.change}
        comparedTo={rejections?.comparedTo}
        infoTitle="Отказы"
        infoDescription="Этот график показывает общий процент отказов. Отказом считается визит, в рамках которого состоялся просмотр лишь одной страницы, продолжающийся менее 15 секунд. Этот показатель демонстрирует, насколько сайт соответствует запросу пользователя. Чем ниже процент отказов, тем лучше."
      >
        {enableRejectionsCard ? (
          <Chart
            withDynamic={false}
            id="rejections"
            type={graphType}
            series={rejections?.series}
            categories={rejections?.categories}
            isLoading={rejectionsLoading}
          />
        ) : (
          <LockedCard label={"Подключить RejectTracking"} />
        )}
      </StatCard>

      {/* Goals Card */}
      <StatCard
        title="Конверсии"
        value={
          enableGoalsCard
            ? goals?.value !== 0
              ? (goals?.value ?? "--") + "%"
              : "Нет данных"
            : null
        }
        change={goals?.value !== 0 ? goals?.change : null}
        comparedTo={goals?.comparedTo}
        infoTitle="Конверсии"
        infoDescription="Этот график показывает количество выполненных целей (конверсий) на сайте. Цели могут включать заполнение форм, звонки, покупки и другие действия, которые посетители совершают на вашем сайте."
      >
        {enableGoalsCard ? (
          <>
            <Chart
              withDynamic={false}
              id="goals"
              type={graphType}
              series={goals?.series}
              categories={goals?.categories}
              isLoading={goalsLoading}
              height="100px"
            />
            <div className="card__select">
              <Select
                options={
                  goals?.conversions?.map((conv) => ({
                    value: conv,
                    label: conv,
                  })) || []
                }
                value={selectedConversion}
                onChange={onConversionChange}
              />
            </div>
          </>
        ) : (
          <LockedCard label={"Подключить GoalTracking"} />
        )}
      </StatCard>

      <StatCard
        title="Количество звонков с сайта"
        // infoTitle="Количество звонков с сайта"
        // infoDescription="Этот блок показывает статистику по звонкам, полученным через сайт. Подключите CallTracking, чтобы начать отслеживать звонки и анализировать их эффективность."
      >
        <LockedCard label={"Подключить CallTracking"} />
      </StatCard>
    </div>
  );
};
