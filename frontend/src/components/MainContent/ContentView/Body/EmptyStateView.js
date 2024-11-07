import React from "react";
import { Folder } from "lucide-react";
import * as SiIcons from "react-icons/si";

const EmptyStateView = ({ courseInfo }) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        {courseInfo && (
          <div className="mb-8 flex flex-col items-center">
            {courseInfo.icon && SiIcons[courseInfo.icon] ? (
              SiIcons[courseInfo.icon]({
                size: 256,
                className: "text-blue-500 mb-4",
              })
            ) : (
              <Folder size={256} className="text-blue-500 mb-4" />
            )}
            <h3 className="text-2xl font-bold mb-2">{courseInfo.name}</h3>
            <p className="text-lg text-gray-600 mb-4">
              Selecciona un archivo para visualizarlo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyStateView;
