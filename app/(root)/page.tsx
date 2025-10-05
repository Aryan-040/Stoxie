import TradingViewWidget from "@/components/TradingViewWidget";
import {
    HEATMAP_WIDGET_CONFIG,
    MARKET_DATA_WIDGET_CONFIG,
    MARKET_OVERVIEW_WIDGET_CONFIG,
    TOP_STORIES_WIDGET_CONFIG
} from "@/lib/constants";

const Home = () => {
    const scriptBase = `https://s3.tradingview.com/external-embedding/`;

    return (
        <div className="home-wrapper">
          <div className="dashboard-header flex flex-col items-center justify-center text-center py-8 mb-6">
            <h1 className="dashboard-title text-3xl font-bold mb-2">Trading Dashboard</h1>
            <p className="dashboard-subtitle text-lg max-w-2xl mx-auto">Monitor markets, track performance, and make informed investment decisions</p>
          </div>
          <section className="grid w-full home-section">
              <div className="md:col-span-1 xl:col-span-1">
                  <TradingViewWidget
                    title="Market Overview"
                    scriptUrl={`${scriptBase}embed-widget-market-overview.js`}
                    config={MARKET_OVERVIEW_WIDGET_CONFIG}
                    className="custom-chart"
                    height={600}
                  />
              </div>
              <div className="md:col-span-1 xl:col-span-2">
                  <TradingViewWidget
                      title="Stock Heatmap"
                      scriptUrl={`${scriptBase}embed-widget-stock-heatmap.js`}
                      config={HEATMAP_WIDGET_CONFIG}
                      height={600}
                  />
              </div>
          </section>
            <section className="grid w-full home-section">
                <div className="h-full md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title="Market News"
                        scriptUrl={`${scriptBase}embed-widget-timeline.js`}
                        config={TOP_STORIES_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
                <div className="h-full md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        title="Market Data"
                        scriptUrl={`${scriptBase}embed-widget-market-quotes.js`}
                        config={MARKET_DATA_WIDGET_CONFIG}
                        height={600}
                    />
                </div>
            </section>
        </div>
    )
}

export default Home;