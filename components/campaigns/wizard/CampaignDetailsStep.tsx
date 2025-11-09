'use client';

interface CampaignDetailsStepProps {
  data: {
    name: string;
    type: 'one-time' | 'sequence' | 'automation';
    from_name: string;
    from_email: string;
    reply_to_email: string;
  };
  onUpdate: (updates: any) => void;
  onNext: () => void;
  onSaveDraft: () => void;
}

export function CampaignDetailsStep({ data, onUpdate, onNext, onSaveDraft }: CampaignDetailsStepProps) {
  const handleNext = () => {
    if (!data.name || !data.from_name || !data.from_email) {
      alert('Please fill in all required fields');
      return;
    }
    onNext();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Details</h2>
      <p className="text-gray-600 mb-6">Set up the basic information for your campaign</p>

      <div className="space-y-6">
        {/* Campaign Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={data.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="e.g., Welcome Series - Week 1"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          />
        </div>

        {/* Campaign Type */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Type
          </label>
          <select
            id="type"
            value={data.type}
            onChange={(e) => onUpdate({ type: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent bg-white"
          >
            <option value="one-time">One-Time Campaign</option>
            <option value="sequence">Email Sequence</option>
            <option value="automation">Automation</option>
          </select>
        </div>

        {/* From Name */}
        <div>
          <label htmlFor="from_name" className="block text-sm font-medium text-gray-700 mb-2">
            From Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="from_name"
            value={data.from_name}
            onChange={(e) => onUpdate({ from_name: e.target.value })}
            placeholder="e.g., Sarah from YourCompany"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          />
        </div>

        {/* From Email */}
        <div>
          <label htmlFor="from_email" className="block text-sm font-medium text-gray-700 mb-2">
            From Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="from_email"
            value={data.from_email}
            onChange={(e) => onUpdate({ from_email: e.target.value })}
            placeholder="hello@yourcompany.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          />
        </div>

        {/* Reply-To Email */}
        <div>
          <label htmlFor="reply_to_email" className="block text-sm font-medium text-gray-700 mb-2">
            Reply-To Email (optional)
          </label>
          <input
            type="email"
            id="reply_to_email"
            value={data.reply_to_email}
            onChange={(e) => onUpdate({ reply_to_email: e.target.value })}
            placeholder="support@yourcompany.com"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a1aff] focus:border-transparent"
          />
          <p className="mt-1 text-sm text-gray-500">
            If different from the "From Email", replies will go to this address
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-8 mt-8 border-t border-gray-200">
        <button
          onClick={onSaveDraft}
          className="px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-900 rounded-lg hover:border-gray-300 transition-colors"
        >
          Save as Draft
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-[#1a1aff] text-white rounded-lg hover:bg-[#0000cc] transition-colors"
        >
          Continue to Content
        </button>
      </div>
    </div>
  );
}

