import SearchDropdown from "@/components/common/SearchDropdown";

type Company = {
  name: string;
  slug: string;
};

type CompanyChooserProps = {
  companies: Company[];
  onSelect: (slug: string) => void;
}


export default function CompanyChooser({
  companies,
  onSelect,
}: CompanyChooserProps) {
  return (
    <SearchDropdown
      items={companies.map((c) => ({
        label: c.name,
        value: c.slug,
      }))}
      placeholder="Search company…"
      minChars={2}
      onSelect={onSelect}
      emptyText="No companies found"
    />
  );
}
