export default function JobCard({ job }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition max-w-xl" style={{ maxWidth: '25rem' }}>

            {/* Header */}
            <div className="d-flex justify-content-cneter align-items-center gap-4">
                <img
                    src={job.companyLogo}
                    alt={job.companyName}
                />

                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {job.jobTitle}
                    </h3>
                    <p className="text-gray-500 text-sm">{job.companyName}</p>
                </div>
            </div>

            {/* Meta */}
            <div className="d-flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                <span>📍 {job.jobGeo}</span>
                <span>💼 {job.jobType?.join(", ")}</span>
                <span>⭐ {job.jobLevel}</span>
            </div>

            {/* Industry */}
            <div className="mt-3">
                {job.jobIndustry?.map((industry, i) => (
                    <span
                        key={i}
                        className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md mr-2"
                    >
                        {industry}
                    </span>
                ))}
            </div>

            {/* Description */}
            <p className="mt-4 text-sm text-gray-700 line-clamp-3">
                {job.jobExcerpt}
            </p>

            {/* Actions */}
            <div className="d-flex justify-content-between align-items-center mt-5">
                <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    View Job
                </a>

                <button className="border border-gray-300 text-sm px-4 py-2 rounded-lg hover:bg-gray-100">
                    Save
                </button>
            </div>
        </div>
    );
}