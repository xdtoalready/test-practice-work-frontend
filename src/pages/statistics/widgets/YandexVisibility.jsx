import React, { useState, useEffect, useRef } from "react";
import { Chart } from "../../../shared/ui/chart";
import { InfoModal } from "./InfoModal";
import { Icon } from "../../../shared/ui/icon";
import { SearchEngineSelector } from "../../../widgets/common/ui/SearchEngineSelector";
import { RegionSelector } from "../../../widgets/common/ui/RegionSelector";
import { CustomDatePicker } from "../../../widgets/common/ui/CustomDatePicker";
import { parseDateFromYandex } from "../lib/utils";
import { GraphTypeSelector } from "./GraphTypeSelector";
import { useOutsideClick } from "../../../core/hooks/useOutsideClick";
import { useBodyClassWhen } from "../../../core/hooks/useBodyClassWhen";
import {KeywordsPositions} from "./KeywordsPostitions";

const SERIES_COLORS = {
  "Топ 1-3": "#3198DD",
  "Топ 1-10": "#21936C",
  "Топ 11-30": "#1ABC9C",
  "Топ 31-50": "#94DA90",
  "Топ 51-100": "#BCC8C8",
  "Топ 101+": "#FCC53B",
  "Все запросы": "red",
};

export const YandexVisibility = ({
  positions,
  isLoading,
  selectedStats,
  onStatsChange,
  selectedSearcher,
  selectedRegion,
  searchers,
  regions,
  onSearcherChange,
  onRegionChange,
  projectDataLoading,
  dateRange = {}, // Добавляем значение по умолчанию
  onDateRangeChange,
  graphType,
    keywords,isLoadingKeywrords,keywordsDateRange
}) => {
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const infoRef = useRef(null);
  useOutsideClick(infoRef, () => setIsInfoOpen(false));
  useBodyClassWhen(isInfoOpen, "_info-modal-locked");
  // Добавляем проверку на существование dateRange.start и dateRange.end
  const defaultStartDate = dateRange?.start
    ? new Date(parseDateFromYandex(dateRange.start))
    : new Date();
  const defaultEndDate = dateRange?.end
    ? new Date(parseDateFromYandex(dateRange.end))
    : new Date();
  console.log(defaultEndDate, defaultStartDate, "defaultStartDate");
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);

  // Обновляем useEffect для обработки dateRange
  useEffect(() => {
    if (dateRange?.start && dateRange?.end) {
      setStartDate(defaultStartDate);
      setEndDate(defaultEndDate);
    }
  }, [dateRange]);

  const filteredSeriesWithColors = React.useMemo(() => {
    if (!positions || !positions.data || !positions.data.series) return [];

    // Отфильтровываем серии и добавляем цвета
    return positions.data.series
      .filter((series) => selectedStats.includes(series.name))
      .map((series) => ({
        ...series,
        color: SERIES_COLORS[series.name], // Устанавливаем цвет из нашего словаря
      }));
  }, [positions, selectedStats]);

  const selectedColors = React.useMemo(() => {
    return filteredSeriesWithColors.map(
      (series) => series.color || SERIES_COLORS[series.name],
    );
  }, [filteredSeriesWithColors]);

  // Filter series based on selected stats
  const filteredSeries = React.useMemo(() => {
    if (!positions || !positions.data || !positions.data.series) return [];
    return positions.data.series.filter((series) =>
      selectedStats.includes(series.name),
    );
  }, [positions, selectedStats]);

  // Get the search engine name - default to "Яндекс" if not available
  const searcherName = selectedSearcher?.name || "Яндекс";

  // Reset dates to default range (last 7 days)
  const resetDates = () => {
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    setStartDate(weekAgo);
    setEndDate(today);
    onDateRangeChange({
      start: formatDate(weekAgo),
      end: formatDate(today),
    });
  };

  // Format date to DD.MM.YYYY
  const formatDate = (date) => {
    if (!date) return "";
    return `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}.${date.getFullYear()}`;
  };

  // Fetch positions when date range changes

  const getColorForStat = (statTitle) => {
    return SERIES_COLORS[statTitle] || "#6F767E"; // Серый по умолчанию
  };

  return (
    <div
      ref={infoRef}
      className={`requests card visibility info-modal-wrap ${isInfoOpen ? "_active" : ""}`}
      style={{ padding: "24px", position: "relative" }}
    >
      <div className={"shop__control"}>
        <div
          className="shop__nav shop__nav-links period-dl"
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "0px",
            padding: "12px 0",
          }}
        >
          <SearchEngineSelector
            searchers={searchers}
            selectedSearcher={selectedSearcher}
            onSearcherChange={onSearcherChange}
            isLoading={projectDataLoading}
          />

          <RegionSelector
            regions={regions}
            selectedRegion={selectedRegion}
            onRegionChange={onRegionChange}
            isLoading={projectDataLoading}
          />

          <CustomDatePicker
            startDate={startDate}
            endDate={endDate}
            onDateChange={(dates) => {
              const [start, end] = dates;
              setStartDate(start);
              setEndDate(end);
            }}
            onApply={(dates) => {
              onDateRangeChange({
                start: dates.start,
                end: dates.end,
              });
            }}
            onReset={resetDates}
          />
        </div>
        <button
          className="button-square-stroke button-small filters__head info-modal-btn "
          onClick={() => setIsInfoOpen(true)}
        >
          <Icon name="info" />
        </button>
      </div>
      <div className="requests__titles">
        <h2>Видимость {searcherName}</h2>
        <button
          className="button-square-stroke button-small filters__head info-modal-btn "
          onClick={() => setIsInfoOpen(true)}
        >
          <Icon name="info" />
        </button>
      </div>

      <div
        className={`requests__checkboxes info-modal-block ${isInfoOpen ? "_active" : ""}`}
      >
        {positions?.data?.stats?.map((stat, index) => (
          <div
            key={index}
            className={`requests__checkboxes-item _${stat.color}`}
          >
            <label className="checkbox">
              <input
                className="checkbox__input"
                name="position_stats"
                type="checkbox"
                checked={selectedStats.includes(stat.title)}
                onChange={() => {
                  if (selectedStats.includes(stat.title)) {
                    onStatsChange(
                      selectedStats.filter((s) => s !== stat.title),
                    );
                  } else {
                    onStatsChange([...selectedStats, stat.title]);
                  }
                }}
              />
              <span className="checkbox__inner">
                <span className="checkbox__tick"></span>
              </span>
            </label>
            <div>
              <div className="checkboxes-item__title">{stat.title}</div>
              <p>
                {stat.count} <span>({stat.percentage}%)</span>
              </p>
            </div>
          </div>
        ))}
        <InfoModal
          title={`Видимость ${searcherName}`}
          description={`Этот график показывает видимость сайта в поисковой системе ${searcherName}. Видимость отражает, насколько хорошо ваш сайт представлен в поисковых результатах по отслеживаемым запросам.`}
          onClose={() => setIsInfoOpen(false)}
        />
      </div>

      <div
        className="card__chart card__chart_search_visits"
        style={{ marginTop: "40px", height: "400px" }}
      >
        <Chart
          id="positions-chart"
          type={graphType}
          topDynamics={positions?.data?.topDynamics}
          series={filteredSeriesWithColors}
          categories={positions?.data?.categories || []}
          isLoading={isLoading}
          colors={selectedColors} // Передаем только цвета выбранных серий
          options={{
            chart: {
              height: "100%",
              animations: {
                enabled: true,
              },
              toolbar: {
                show: false,
              },
            },
            tooltip: {
              enabled: true,
              shared: true,
              intersect: false,
            },
          }}
        />
      </div>
      <KeywordsPositions
          keywords={keywords}
          keywordsDateRange={keywordsDateRange}
          isLoading={isLoadingKeywrords}
      />
    </div>
  );
};
