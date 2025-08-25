import React, { useEffect, useState } from "react";
import { useStatisticsStore } from "../state/statistics.store";
import { PeriodSelector } from "../../../widgets/common/ui/PeriodSelector";
import { GraphTypeSelector } from "../widgets/GraphTypeSelector";
import { StatisticsTabs } from "./StatisticsTabs/StatisticsTabs";
import { SearchEngineSelector } from "../../../widgets/common/ui/SearchEngineSelector";
import { RegionSelector } from "../../../widgets/common/ui/RegionSelector";
import { YandexVisibility } from "../widgets/YandexVisibility";
import { KeywordsPositions } from "../widgets/KeywordsPostitions";
import { HowToModal } from "../widgets/HowToModal";
import { Layout } from "../../../shared/ui/layout";
import { useEffectOnce } from "../../../core/hooks/useEffectOnce";
import {
  getActiveServiceFromStorage,
  getActiveServiceTypeFromStorage,
  noStatsServiceTypes,
  serviceHasMetricsData,
} from "../../../core/lib/utils";
import { useLocation, useNavigate } from "react-router-dom";

export const StatisticsPage = () => {
  const {
    period,

    setPeriod,
    dateRange,
    positionsDateRange,
    setPositionsDateRange,
    setKeywordsDateRange,
    setDateRange,
    graphType,
    setGraphType,
    visits,
    rejections,
    goals,
    visitsLoading,
    rejectionsLoading,
    goalsLoading,
    positionsLoading,
    keywordsLoading,
    positions,
    keywords,
    selectedRegionKeywords,
    selectedSearcherKeywords,
    setSelectedSearcherKeywords,
    setSelectedRegionKeywords,
    cities,
    groups,
    keywordsDateRange,
    selectedConversion,
    setSelectedConversion,
    selectedCities,
    selectedGroups,
    setSelectedCities,
    setSelectedGroups,
    fetchVisits,
    fetchRejections,
    fetchGoals,
    fetchPositions,
    fetchKeywords,
    // New properties and methods
    fetchProjectData,
    projectDataLoading,
    searchers,
    regions,
    regionsKeywords,
    fetchGoalsList,
    selectedSearcher,
    selectedRegion,
    setSelectedSearcher,
    setSelectedRegion,
    isProjectDataLoaded,
  } = useStatisticsStore();
  const serviceIdFromStorage = getActiveServiceFromStorage();
  const serviceType = getActiveServiceTypeFromStorage();
  const [serviceId, setServiceId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkServiceId = () => {
      const id = getActiveServiceFromStorage();
      if (id) {
        setServiceId(id);
      } else {
        const interval = setInterval(() => {
          const id = getActiveServiceFromStorage();
          if (id) {
            setServiceId(id);
            clearInterval(interval);
          }
        }, 100);
        return () => clearInterval(interval);
      }
    };

    checkServiceId();
  }, [serviceIdFromStorage]);

  useEffect(() => {
    if (
      noStatsServiceTypes.includes(serviceType) &&
      location.pathname.includes("statistics")
    ) {
      navigate("/tasks");
    }
  }, []);

  const [howToModalOpen, setHowToModalOpen] = useState(false);
  const [selectedStats, setSelectedStats] = useState([
    "Топ 1-3",
    "Топ 1-10",
    "Топ 11-30",
    "Топ 31-50",
    "Топ 51-100",
    "Топ 101+",
  ]);

  useEffect(() => {
    if (!serviceId) return;
    debugger
    if (serviceHasMetricsData(serviceType)) {
      fetchGoalsList(serviceId);
    }
    fetchProjectData(serviceId);
  }, [serviceId]);
  useEffect(() => {
    if (!serviceId) return;
    if (serviceHasMetricsData(serviceType)) {
      fetchVisits(serviceType,serviceId);
      fetchRejections(serviceType,serviceId);
      fetchGoals(serviceId);

    }
  }, [period, dateRange, serviceType,serviceId]);

  useEffect(() => {
    if (!serviceId) return;
    if (selectedConversion && serviceHasMetricsData(serviceType)) {
      fetchGoals(serviceId);
    }
  }, [selectedConversion,serviceId]);

  // Reload positions when selected searcher or region changes
  useEffect(() => {
    if (!serviceId) return;
    if (selectedSearcher && selectedRegion && serviceId) {
      debugger
      fetchPositions(serviceId);
    }
  }, [selectedSearcher, selectedRegion, positionsDateRange,serviceId]);

  // Reload keywords when selected cities or groups change
  useEffect(() => {
    if (!serviceId) return;
    if (selectedSearcherKeywords && selectedRegionKeywords) {
      fetchKeywords(serviceId);
    }
  }, [selectedSearcherKeywords, selectedRegionKeywords, keywordsDateRange,serviceId]);

  // Handle conversion change
  const handleConversionChange = (newConversion) => {
    setSelectedConversion(newConversion);
  };

  return (
    <Layout>
      <div
        className="page__inner statistics-page"
        style={{ background: "#f4f4f4" }}
      >
        <div className="shop__control">
          <PeriodSelector
            period={period}
            onPeriodChange={setPeriod}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <GraphTypeSelector type={graphType} onChange={setGraphType} />
        </div>

        <div className="page__row">
          <StatisticsTabs
            serviceType={serviceType}
            visits={visits?.data}
            rejections={rejections?.data}
            goals={goals?.data}
            visitsLoading={visitsLoading}
            rejectionsLoading={rejectionsLoading}
            goalsLoading={goalsLoading}
            graphType={graphType}
            selectedConversion={selectedConversion}
            onConversionChange={handleConversionChange}
          />
        </div>

        {/* Add search engine and region selectors */}

        <YandexVisibility
          graphType={graphType}
          positions={positions}
          isLoading={positionsLoading}
          selectedStats={selectedStats}
          onStatsChange={setSelectedStats}
          selectedSearcher={selectedSearcher}
          selectedRegion={selectedRegion}
          searchers={searchers}
          regions={regions}
          onSearcherChange={(searcher)=>{
            setSelectedSearcher(searcher)
            setSelectedSearcherKeywords(searcher)
          }}
          onRegionChange={(region)=>{
            setSelectedRegion(region)
            setSelectedRegionKeywords(region)
          }}
          projectDataLoading={projectDataLoading}
          dateRange={positionsDateRange} // Используем отдельный dateRange
          onDateRangeChange={(date)=>{
            setPositionsDateRange(date)
            setKeywordsDateRange(date)
          }} // И его метод обновления
          fetchPositions={fetchPositions}
          keywords={keywords}
          isLoadingKeywrords={keywordsLoading}
          keywordsDateRange={keywordsDateRange}
        />

        {/*<KeywordsPositions*/}
        {/*  onSearcherChange={setSelectedSearcherKeywords}*/}
        {/*  onRegionChange={setSelectedRegionKeywords}*/}
        {/*  keywords={keywords}*/}
        {/*  searchers={searchers}*/}
        {/*  regions={regionsKeywords}*/}
        {/*  selectedSearcher={selectedSearcherKeywords}*/}
        {/*  selectedRegion={selectedRegionKeywords}*/}
        {/*  selectedCities={selectedCities}*/}
        {/*  selectedGroups={selectedGroups}*/}
        {/*  onCitiesChange={setSelectedCities}*/}
        {/*  onGroupsChange={setSelectedGroups}*/}
        {/*  onKeywordsDateRangeChange={setKeywordsDateRange}*/}
        {/*  keywordsDateRange={keywordsDateRange}*/}
        {/*  isLoading={keywordsLoading}*/}
        {/*/>*/}

        <HowToModal
          isOpen={howToModalOpen}
          onClose={() => setHowToModalOpen(false)}
        />

        <div
          className={`black-overlay ${howToModalOpen ? "active" : ""}`}
          onClick={() => setHowToModalOpen(false)}
        ></div>
      </div>
    </Layout>
  );
};
