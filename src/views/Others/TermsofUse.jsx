import LandingHeading from "@/components/Landing/LandingHeading/LandingHeading";

function TermsofUse() {
  const policies = [
    {
      title: "Terms of Use",
      description: "These Terms of Use (\"Terms\") were last updated on August 1, 2020.",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur volutpat maximus pellentesque. Integer sem enim, luctus at nibh at, condimentum sagittis sapien. Sed tempus ipsum erat, sit amet efficitur velit interdum eu. Vestibulum hendrerit id dolor eu scelerisque."
    },
    {
      title: "Privacy Policy",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur volutpat maximus pellentesque. Integer sem enim, luctus at nibh at, condimentum sagittis sapien. Sed tempus ipsum erat, sit amet efficitur velit interdum eu. Vestibulum hendrerit id dolor eu scelerisque."
    },
    {
      title: "Cookie Policy",
      description: "Phasellus ex dui, consequat nec feugiat eu, dapibus eget ante. Sed sodales interdum dui, at euismod mi feugiat hendrerit. Suspendisse auctor libero in tempor mollis. Nulla et dolor velit. Aliquam sit amet luctus quam."
    },
    {
      title: "Copyright Policy",
      description: "Nam a egestas libero, eget eleifend turpis. Sed id ipsum a ipsum aliquam laoreet sit amet sit amet nibh. Proin dapibus, libero sed posuere rhoncus, orci mi cursus enim, at accumsan eros massa lacina mi. Nunc eget finibus felis, volutpat malesuada sem. Aliquam ac nisi pellentesque, varius neque sit amet, porttitor nunc. Nullam elit tellus, dapibus non eleifend sed, hendrerit eget velit. Aliquam ut felis dictum, tincidunt magna vitae, aliquam massa. In porttitor tristique quam, non dignissim sapien pharetra ultrices. Cras non ante non velit mollis mollis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque et bibendum urna, eget consequat sapien. Integer sed condimentum nibh. Integer id neque tristique, lobortis massa ac, dapibus nibh. Donec nulla odio, porttitor ac rutrum eget, volutpat a velit. Curabitur et enim quis diam congue dictum et vitae dui. Nulla tortor orci, luctus a pretium vel, ultrices porta nisi."
    },
    {
      title: "Learnify API Agreement",
      description: "Etiam lobortis dictum tincidunt. Interdum et malesuada fames ac ante ipsum primis in faucibus. Suspendisse ultricies efficitur dui, suscipit tempus elit condimentum quis. Duis sed vestibulum tortor, eget cursus odio."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <header className="mb-8 text-center">
           <LandingHeading header="Terms of Use" />
        </header>

       {/* Policies Section */}
<div className="bg-card rounded-lg shadow-sm overflow-hidden">

  {/* ===== Desktop Table ===== */}
  <div className="hidden md:block overflow-x-auto">
    <table className="w-full">
      <thead className="bg-card">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-medium uppercase w-1/4">
            Policy
          </th>
          <th className="px-6 py-4 text-left text-sm font-medium uppercase w-3/4">
            Description
          </th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {policies.map((policy, index) => (
          <tr key={index}>
            <td className="px-6 py-4">
              <h3 className="text-lg font-semibold">
                {policy.title}
              </h3>
            </td>
            <td className="px-6 py-4">
              <p className="leading-relaxed text-text-secondary">
                {policy.description}
              </p>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* ===== Mobile Cards ===== */}
  <div className="md:hidden p-4 space-y-4">
    {policies.map((policy, index) => (
      <div
        key={index}
        className="border rounded-lg p-4 shadow-sm space-y-2"
      >
        <h3 className="text-lg font-semibold">
          {policy.title}
        </h3>

        <p className="text-sm text-text-secondary leading-relaxed">
          {policy.description}
        </p>
      </div>
    ))}
  </div>

</div>


        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200 text-center text-text-secondary text-sm">
          {/* <div className="flex flex-wrap justify-center space-x-6 mb-4">
            <a href="#" className="hover:text-gray-900">Copyright Policy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Privacy Policy</a>
          </div> */}
          <p>© 2025 Learnify. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default TermsofUse;