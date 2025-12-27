import { useEffect, useState } from "react";
import ArticleCard from "../../components/cards/article_card/ArticleCard";
import MyButton from "../../components/common/my_button/MyButton";
import CreateBlogModal from "../../components/modals/create_blog/BlogModal";
import BlogToast from "../../components/common/my_toast/MyToast";
import colors from "../../theme/colors";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import "./Articles.css";
import Select from "react-select";
import CategorySelector from "../../components/common/category_selector/CategorySelector";
import { useTranslation } from "react-i18next";

const MyArticles = ({ myArticles }) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const [articles, setArticles] = useState([
    {
      id: 1132,
      title: 22,
      author: "razan1",
      created: "2025-12-26\n",
      field_image:
        "/api/sites/default/files/2025-12/Gemini_Generated_Image7_8.png",
      body: 22,
      field_gallery:
        "/api/sites/default/files/2025-12/Gemini_Generated5_6.png, /api/sites/default/files/2025-12/Gemini_Generated4_5.png",
      field_tags: ["Samsung", "iphone", "wireless"],
    },
    {
      id: 1131,
      title: 11,
      author: "razan1",
      created: "2025-12-26\n",
      field_image:
        "/api/sites/default/files/2025-12/Gemini_Generated_Image7_3.png",
      body: 11,
      field_gallery:
        "/api/sites/default/files/2025-12/unnameds.jpg, /api/sites/default/files/2025-12/Gemini_Generated5_3.png",
      field_tags: ["iphone"],
    },
    {
      id: 1130,
      title: "im title ",
      author: "Tamkeen",
      created: "2025-12-26\n",
      field_image: "/api/sites/default/files/2025-12/21.jpg",
      body: "im body",
      field_gallery:
        "/api/sites/default/files/2025-12/6_0.jpg, /api/sites/default/files/2025-12/7.jpg, /api/sites/default/files/2025-12/10.jpg",
      field_tags: ["social media", "Samsung"],
    },
    {
      id: 1129,
      title: 4,
      author: "razan1",
      created: "2025-12-26\n",
      field_image: "/api/sites/default/files/2025-12/Gemini_Generated2_0.png",
      body: 4,
      field_gallery:
        "/api/sites/default/files/2025-12/unnameds_4.jpg, /api/sites/default/files/2025-12/Gemini_Generated_Image_0.png",
      field_tags: ["social media"],
    },
    {
      id: 1128,
      title: 1,
      author: "razan1",
      created: "2025-12-26\n",
      field_image: "/api/sites/default/files/2025-12/Gemini_Generated3_3.png",
      body: 1,
      field_gallery: "",
      field_tags: ["social media"],
    },
    {
      id: 1121,
      title: "Edited: aaaaaaaaaaaaaaaaaaaaaa",
      author: "Tamkeen",
      created: "2025-12-25\n",
      field_image: "/api/sites/default/files/2025-05/your-image1.jpg",
      body: "Edi:aaaaaaaaaaaaaaaaaa",
      field_gallery:
        "/api/sites/default/files/2025-07/tamkeen_21.png, /api/sites/default/files/2025-07/about4.png",
      field_tags: [],
    },
    {
      id: 1120,
      title: "user12234",
      author: "masa",
      created: "2025-12-25\n",
      field_image: "/api/sites/default/files/2025-12/download_0.jpg",
      body: "social medaia samsung phone",
      field_gallery:
        "/api/sites/default/files/2025-12/download%20%281%29_6.jpg, /api/sites/default/files/2025-12/image.jpeg, /api/sites/default/files/2025-12/people.png",
      field_tags: ["wireless", "Samsung"],
    },
    {
      id: 1117,
      title: "ffffffffffff",
      author: "Tamkeen",
      created: "2025-12-25\n",
      field_image:
        "/api/sites/default/files/2025-12/2024_Nitro_Default_3840x2400.jpg",
      body: "",
      field_gallery: "",
      field_tags: ["iphone"],
    },
    {
      id: 1116,
      title: "tamkeen",
      author: "Tamkeen",
      created: "2025-12-25\n",
      field_image:
        "/api/sites/default/files/2025-12/Screenshot%202025-10-29%20141332%20-%20Copy_1.png",
      body: "oooooooooooooooooooooooooooo",
      field_gallery: "",
      field_tags: ["Samsung"],
    },
    {
      id: 1115,
      title: "ekram",
      author: "Tamkeen",
      created: "2025-12-25\n",
      field_image: "/api/sites/default/files/2025-12/aaa_4.png",
      body: "tamkeen",
      field_gallery:
        "/api/sites/default/files/2025-12/aaa_3.png, /api/sites/default/files/2025-12/Screenshot%202025-10-29%20141332%20-%20Copy_0.png, /api/sites/default/files/2025-12/sss%20-%20Copy_0.png",
      field_tags: [],
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  // UI state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState("created_date");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handleOpen = () => setShowModal(true);
  const handleCloseConfirmed = () => setShowModal(false);
  const [showModal, setShowModal] = useState(false);

  const [articleAdded, setArticleAdded] = useState(false);
  const handleArticleAdded = () => setArticleAdded(true);

  const [tags, setTags] = useState([
    { id: "1", name: "wireless" },
    { id: "2", name: "social media" },
    { id: "3", name: "Samsung" },
    { id: "4", name: "iphone" },
  ]);
  const [categories, setCategories] = useState([
    { id: "5", name: "Education" },
    { id: "6", name: "technology" },
    { id: "7", name: "laptop" },
    { id: "8", name: "business" },
  ]);

  // Fetch whenever filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {}, 1500); // debounce for live search

    return () => clearTimeout(delayDebounce);
  }, [search, category, tag, sortBy, sortOrder, page, itemsPerPage]);

  const options = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const tagOptions = tags.map((tag) => ({
    value: tag.id,
    label: tag.name,
  }));

  const sortOptions = [
    {
      value: "created_date",
      label: isArabic ? "تاريخ الإنشاء" : "Created Date",
    },
    { value: "title", label: isArabic ? "العنوان" : "Title" },
  ];

  const sortOrderOptions = [
    { value: "ASC", label: isArabic ? "تصاعدي" : "Ascending" },
    { value: "DESC", label: isArabic ? "تنازلي" : "Descending" },
  ];

  return (
    <div className="container px-md-0 py-5 overflow-hidden">
      <BlogToast
        show={articleAdded}
        setShow={setArticleAdded}
        message={
          isArabic
            ? "تمت إضافة المقال بنجاح! 🎉"
            : "Blog added successfully! 🎉"
        }
        type="success"
      />
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start mb-4">
        <h1
          className="fw-bold mb-4"
          data-aos="fade-right"
          data-aos-duration="800"
          data-aos-delay="100"
        >
          {isArabic ? "المقالات" : "Articles"}
        </h1>

        <div data-aos="fade-left" data-aos-duration="800" data-aos-delay="300">
          <MyButton
            text={isArabic ? "إنشاء مقال" : "Create Blog"}
            onClick={handleOpen}
          />
        </div>
      </div>
      {/* Filters */}
      <div className="row g-3 mb-3">
        {/* Search */}
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder={
              isArabic
                ? "ابحث في العنوان أو المحتوى..."
                : "Search title or body..."
            }
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            style={{
              boxShadow: "none",
              borderRadius: "0", // optional: makes it square
            }}
          />
        </div>

        {/* Category */}
        <CategorySelector
          variant="filter"
          categories={categories}
          selectedCategoryId={category}
          setSelectedCategoryId={setCategory}
          onPageReset={() => setPage(0)}
          label={isArabic ? "كل الفئات" : "All Categories"}
        />

        {/* Tags */}
        <div className="col-md-2">
          <Select
            options={[
              { value: "", label: isArabic ? "كل الوسوم" : "All Tags" },
              ...tagOptions,
            ]}
            value={[
              { value: "", label: isArabic ? "كل الوسوم" : "All Tags" },
              ...tagOptions,
            ].find((option) => option.value === tag)} // ✅ now includes "All Tags"
            placeholder={isArabic ? "وسم" : "Tag"}
            onChange={(selected) => {
              setTag(selected?.value || "");
              setPage(0);
            }}
            styles={{
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? colors.secondary : "#fff",
                color: "#333",
                cursor: "pointer",
                borderInlineStart: state.isFocused
                  ? `3px solid ${colors.primary}`
                  : "3px solid transparent",
                ":active": {
                  ...provided[":active"],
                  borderInlineStartColor: "transparent",
                  backgroundColor: "transparent",
                },
              }),
              control: (provided, state) => ({
                ...provided,
                borderRadius: "",
                boxShadow: "",
                borderColor: state.isFocused ? colors.primary : "#cfcfcf",
                "&:hover": {
                  borderColor: colors.primary,
                },
              }),
            }}
          />
        </div>

        {/* Sort By */}
        <div className="col-md-2">
          <Select
            options={sortOptions}
            value={sortOptions.find((option) => option.value === sortBy)}
            onChange={(selectedOption) => setSortBy(selectedOption.value)}
            styles={{
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? colors.secondary : "#fff",
                color: "#333",
                cursor: "pointer",
                borderInlineStart: state.isFocused
                  ? `3px solid ${colors.primary}`
                  : "3px solid transparent",
                ":active": {
                  ...provided[":active"],
                  borderInlineStartColor: "transparent",
                  backgroundColor: "transparent",
                },
              }),
              control: (provided, state) => ({
                ...provided,
                borderRadius: "",
                boxShadow: "",
                borderColor: state.isFocused ? colors.primary : "#cfcfcf",
                "&:hover": {
                  borderColor: colors.primary,
                },
              }),
            }}
          />
        </div>

        {/* Sort order */}
        <div className="col-md-2 mb-3">
          <Select
            className="mb-3"
            options={sortOrderOptions}
            value={sortOrderOptions.find(
              (option) => option.value === sortOrder
            )}
            onChange={(selectedOption) => setSortOrder(selectedOption.value)}
            styles={{
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? colors.secondary : "#fff",
                color: "#333",
                cursor: "pointer",
                borderInlineStart: state.isFocused
                  ? `3px solid ${colors.primary}`
                  : "3px solid transparent",
                ":active": {
                  ...provided[":active"],
                  borderInlineStartColor: "transparent",
                  backgroundColor: "transparent",
                },
              }),
              control: (provided, state) => ({
                ...provided,
                borderRadius: "",
                boxShadow: "",
                borderColor: state.isFocused ? colors.primary : "#cfcfcf",
                "&:hover": {
                  borderColor: colors.primary,
                },
              }),
            }}
          />
        </div>
      </div>

      {loading ? (
        <DotLottieReact
          src="https://lottie.host/92f59356-5b43-42ef-94b3-aae95bd16fa8/pR54LzjQKh.lottie"
          loop
          autoplay
        />
      ) : articles.length > 0 ? (
        <div className="row g-4">
          {articles.map((article, index) => (
            <ArticleCard
              article={article}
              variant="detailed"
              articleKey={index}
            />
          ))}
        </div>
      ) : (
        <DotLottieReact
          src="https://lottie.host/b8fb564e-5512-4d4f-93bc-5ce8ead88879/IWXk4dLfts.lottie"
          loop
          autoplay
        />
      )}

      {/* Pagination */}
      {articles.length > 0 ? (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <MyButton
            text={isArabic ? "السابق" : "Prev"}
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
          />

          <div>
            {isArabic ? "الصفحة" : "Page"}{" "}
            <div className="d-inline-flex mt-2">
              <input
                style={{
                  backgroundColor: colors.primary,
                  borderColor: colors.primary,
                }}
                type="number"
                min="1"
                max={totalPages}
                value={page + 1}
                onChange={(e) => {
                  const val = Number(e.target.value) - 1;
                  if (val >= 0 && val < totalPages) {
                    setPage(val);
                  }
                }}
              />
            </div>{" "}
            {isArabic ? "من" : "of"} {totalPages}
          </div>

          <MyButton
            text={isArabic ? "التالي" : "Next"}
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          />
        </div>
      ) : (
        ""
      )}

      {/* Create Modal */}
      <div className="text-center">
        <CreateBlogModal
          tags={tags}
          show={showModal}
          handleCloseConfirmed={handleCloseConfirmed}
          articleAddedFun={handleArticleAdded}
        />
      </div>
    </div>
  );
};

export default MyArticles;
