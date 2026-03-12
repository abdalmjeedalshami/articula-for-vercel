import { useEffect, useMemo, useState, useCallback } from "react";
import JobCard from "../../components/cards/job_card/JobCard";
import { useTranslation } from "react-i18next";
import { Container, Row } from "react-bootstrap";
import MyButton from "../../components/common/my_button/MyButton";
import colors from "../../theme/colors";
import MyForm from "../../components/common/my_form/MyForm";

const PAGE_SIZE = 10;

const JobsList1 = () => {
    const { i18n } = useTranslation();
    const isArabic = i18n.language === "ar";

    const [jobs, setJobs] = useState([]);

    const [query, setQuery] = useState("");
    const [geo, setGeo] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch 20 jobs once on mount
    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await fetch(
                    "https://jobicy.com/api/v2/remote-jobs",
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                // The Jobicy API returns an object with `jobs` (array)
                const items = Array.isArray(data?.jobs) ? data.jobs : [];
                if (isMounted) {
                    setJobs(items);
                    setCurrentPage(1);
                }
            } catch (e) {
                if (e.name !== "AbortError") {
                    setError(e.message || "Failed to fetch jobs");
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        load();
        return () => {
            isMounted = false;
            controller.abort();
        };
    }, []);

    const fetchJobs = useCallback(async ({ geoParam = '', q = '' } = {}) => {
        setLoading(true);
        setError(null);

        const controller = new AbortController();
        const params = new URLSearchParams({});
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
            console.log("Number of jobs: ", nextJobs)

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

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(jobs.length / PAGE_SIZE)),
        [jobs.length]
    );

    const pagedJobs = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        return jobs.slice(start, start + PAGE_SIZE);
    }, [jobs, currentPage]);

    const goToPage = (page) => {
        setCurrentPage((prev) => {
            const next = Math.min(Math.max(page, 1), totalPages);
            return next;
        });
    };

    const nextPage = () => goToPage(currentPage + 1);
    const prevPage = () => goToPage(currentPage - 1);

    // Returns an array like: [1, '…', 23, 24, 25, '…', 50]
    const getPageNumbers = (currentPage, totalPages, siblingCount = 1) => {
        // siblingCount = how many pages to show on each side of current
        const totalNumbers = siblingCount * 2 + 5; // first + last + current + 2*siblings + 2 ellipses
        if (totalPages <= totalNumbers) {
            // No need for ellipses
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const leftSibling = Math.max(currentPage - siblingCount, 2);
        const rightSibling = Math.min(currentPage + siblingCount, totalPages - 1);

        const showLeftEllipsis = leftSibling > 2;
        const showRightEllipsis = rightSibling < totalPages - 1;

        const range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

        const pages = [];

        pages.push(1);

        if (showLeftEllipsis) {
            pages.push("…");
        }

        pages.push(...range(leftSibling, rightSibling));

        if (showRightEllipsis) {
            pages.push("…");
        }

        pages.push(totalPages);

        return pages;
    };

    return (
        <div >
            {loading && <p>Loading…</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {!loading && !error && pagedJobs.length === 0 && (
                <p>No jobs found.</p>
            )}

            <Container>
                <MyForm fields={fields} onSubmit={handleSubmit} buttonText={loading ? isArabic ? "جارٍ التحميل..." : "Loading..." : isArabic ? "بحث" : "Search"} />
                <Row className="my-4">
                    {pagedJobs.map((job, index) => {
                        const hasSalary =
                            job?.salaryMin != null &&
                            job?.salaryMax != null &&
                            job.salaryMin !== "" &&
                            job.salaryMax !== "" &&
                            job.salaryMin !== "NaN" &&
                            job.salaryMax !== "NaN";

                        const salaryValue = hasSalary
                            ? job.salaryMin === job.salaryMax
                                ? job.salaryMax
                                : (job.salaryMin + job.salaryMax) / 2
                            : null;

                        const salaryObj = {
                            value: salaryValue,
                            currency: job.salaryCurrency || "",
                            period: job.salaryPeriod || "",
                            rawMin: job.salaryMin,
                            rawMax: job.salaryMax,
                            disclosed: hasSalary
                        };

                        return (<JobCard
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
                                tags: job.jobGeo,
                                description: job.jobExcerpt,
                                salary: salaryObj,
                                url: job.url,
                                // salary:
                                //     job?.salaryMin != null &&
                                //         job?.salaryMax != null &&
                                //         job.salaryMin !== "" &&
                                //         job.salaryMax !== "" &&
                                //         job.salaryMin !== "NaN" &&
                                //         job.salaryMax !== "NaN"
                                //         ? job.salaryMin === job.salaryMax
                                //             ? `${job.salaryMax}` // same value
                                //             : `${(job.salaryMin + job.salaryMax) / 2}` // midpoint
                                //         : "Undisclosed",
                                // salaryCurrency: job.salaryCurrency,
                                // salaryPeriod: job.salaryPeriod,
                            }}
                        />);

                    })}
                </Row>
            </Container>

            {/* Pagination controls */}
            <Container className="pb-5">
                {jobs.length > 0 && (
                    // <div className="d-flex justify-content-center gap-4">
                    //     {/* Numbered buttons */}
                    //     <div className="d-flex gap-1">
                    //         {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    //             <>
                    //                 <button
                    //                     key={n}
                    //                     onClick={() => goToPage(n)}
                    //                     style={{
                    //                         padding: "8px 12px",
                    //                         background: colors.secondary,
                    //                         border: `1px solid ${colors.primary}`,
                    //                         color: colors.primary,
                    //                         ...(n === currentPage
                    //                             ? {
                    //                                 background: colors.primary,
                    //                                 color: "white"
                    //                             }
                    //                             : {}),
                    //                     }}
                    //                     aria-current={n === currentPage ? "page" : undefined}
                    //                 >
                    //                     {n}
                    //                 </button>
                    //             </>
                    //         ))}
                    //     </div>
                    // </div>
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <MyButton
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            text="‹ Prev"
                        />

                        {getPageNumbers(currentPage, totalPages, 1).map((p, idx) =>
                            p === "…" ? (
                                <>
                                    <span style={{ width: '5px', borderTop: `dotted .15rem ${colors.primary}` }}>
                                    </span>
                                </>
                                // <span key={`ellipsis-${idx}`} style={{ padding: "6px 8px", color: colors.primary }}>…</span>
                            ) : (
                                <button
                                    key={p}
                                    onClick={() => goToPage(p)}
                                    aria-current={p === currentPage ? "page" : undefined}
                                    style={{
                                        padding: "8px 12px",
                                        background: colors.secondary,
                                        border: `1px solid ${colors.primary}`,
                                        color: colors.primary,
                                        ...(p === currentPage
                                            ? {
                                                background: colors.primary,
                                                color: "white"
                                            }
                                            : {}),
                                    }}
                                >
                                    {p}
                                </button>
                            )
                        )}

                        <MyButton
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            text="Next ›"
                        />
                    </div>
                )
                }
            </Container >
        </div >
    );
};

export default JobsList1;

/** Minimal inline  */
// const styles = {
//     container: {
//         maxWidth: 960,
//         margin: "40px auto",
//         padding: "0 16px",
//         fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
//     },
//     title: { marginBottom: 16 },
//     grid: {
//         display: "grid",
//         gridTemplateColumns: "1fr",
//         gap: 16,
//     },
//     card: {
//         padding: 16,
//         borderRadius: 12,
//         border: "1px solid #eee",
//         background: "#fff",
//         boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
//     },
//     pagination: {
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: 12,
//         marginTop: 20,
//     },
//     pageButton: {
//         padding: "8px 12px",
//         borderRadius: 8,
//         border: "1px solid #ddd",
//         background: "#f7f7f7",
//         cursor: "pointer",
//     },
//     pageNumber: {
//         padding: "8px 12px",
//         borderRadius: 8,
//         border: "1px solid #ddd",
//         background: "#fff",
//         cursor: "pointer",
//     },
//     pageNumberActive: {
//         borderColor: "#4F46E5",
//         background: "#EEF2FF",
//         color: "#4F46E5",
//         fontWeight: 600,
//     },
// };