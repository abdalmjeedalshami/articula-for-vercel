import { useCallback, useEffect, useState } from "react"
import JobCard from "../../components/cards/job_card/JobCard";
import { useTranslation } from "react-i18next";
import { Container, Row } from "react-bootstrap";
import MyForm from "../../components/common/my_form/MyForm";

const JobsList = () => {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [jobs, setJobs] = useState([]);

    const [query, setQuery] = useState("");
    const [geo, setGeo] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchJobs = useCallback(async ({ geoParam = '', q = '' } = {}) => {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const params = new URLSearchParams({ count: "10" });
        if (geoParam) params.set("geo", geoParam);

        try {
            const res = await fetch(
                `https://jobicy.com/api/v2/remote-jobs?${params.toString()}`,
                { signal: controller.signal }
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();

            // The Jobicy public API commonly returns { jobs: [...] }
            const nextJobs = data?.jobs ?? data?.items ?? [];

            const filtered =
                q?.trim()
                    ? nextJobs.filter((j) => {
                        const title = j?.jobTitle?.toLowerCase() ?? "";
                        const company = j?.companyName?.toLowerCase() ?? "";
                        const excerpt = j?.jobExcerpt?.toLowerCase() ?? "";
                        const needle = q.toLowerCase();
                        return (
                            title.includes(needle) ||
                            company.includes(needle) ||
                            excerpt.includes(needle)
                        );
                    })
                    : nextJobs;

            setJobs(filtered);
        } catch (e) {
            if (e.name !== "AbortError") {
                setError(e.message || "Failed to fetch jobs");
            }
        } finally {
            setLoading(false);
        }

        // return an abort function so caller can cancel if needed
        return () => controller.abort();
    }, []);


    useEffect(() => {
        let cancel;
        (async () => {
            cancel = await fetchJobs({ geoParam: geo });
        })();
        return () => {
            if (typeof cancel === "function") cancel();
        };
    }, []);


    const handleSubmit = (formData) => {

        const nextQuery = formData?.job ?? query;
        const nextGeo = formData?.geo ?? geo;

        setQuery(nextQuery);
        setGeo(nextGeo);

        fetchJobs({ geoParam: nextGeo, q: nextQuery });
    };


    const fields = [
        { row: true, fields: [{ name: "job", label: "Search", type: "text", placeholder: "Search title, company..." }, { name: "geo", label: "Geo", type: "text", placeholder: "e.g., worldwide, us, eu" }] },
    ];


    return (
        <Container className="my-5">
            <h1>Job Openings</h1>
            <MyForm fields={fields} onSubmit={handleSubmit} buttonText={loading ? isArabic ? "جارٍ التحميل..." : "Loading..." : isArabic ? "بحث" : "Search"} />

            {loading && <p>{isArabic ? "جارٍ التحميل..." : "Loading..."}</p>}
            {error && <p>{isArabic ? "لا توجد نتائج." : "No results found."}</p>}
            {!loading && !error && jobs.length === 0 && (
                <p>{isArabic ? "لا توجد نتائج." : "No results found."}</p>
            )}

            {!loading && !error && jobs.length !== 0 && (
                <Row className="mt-4">
                    {jobs.map((job, index) => (
                        <JobCard
                            key={job.id}
                            index={index}
                            inList
                            job={{
                                image: job.companyLogo,
                                title: job.jobTitle,
                                id: job.id,
                                type: job.jobType,
                                level: job.jobLevel,
                                companyName: job.companyName,
                                tag: {
                                    text: isArabic ? "مميز" : job.jobGeo,
                                    color: "#15711F",
                                    background: "#E1F7E3",
                                },
                                description: job.jobExcerpt,
                                salary: (job.salaryMax - job.salaryMin) / 2
                            }}
                        />
                    ))}
                </Row>)}
        </Container >

    )
}

export default JobsList