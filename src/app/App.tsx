import { Routes, Route } from "react-router-dom";
import useGetSites from "../features/table/api/hooks/use-get-sites";
import useGetTests from "../features/table/api/hooks/use-get-tests";
import { Loader } from "../shared/ui/loader";
import { Table } from "../widgets/table";
import { Header } from "../widgets/header/ui/header";
import { ResultsPage } from "../pages/results";
import { FinalizePage } from "../pages/finalize";

function App() {

  const { sites, loadingSites, errorSites } = useGetSites();
  const { tests, loadingTests, errorTests } = useGetTests();

  if (loadingSites || loadingTests) return <Loader />
  if (errorSites) return <div>Error: {errorSites.message}</div>;
  if (errorTests) return <div>Error: {errorTests.message}</div>;

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Table tests={tests} sites={sites} />} />
        <Route path="/results/:testId" element={<ResultsPage />} />
        <Route path="/finalize/:testId" element={<FinalizePage />} />
      </Routes>
    </>
  );
}

export default App;
