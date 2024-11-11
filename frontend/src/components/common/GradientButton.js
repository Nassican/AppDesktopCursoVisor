import React from "react";

const GradientButton = ({
  onClick,
  href,
  startColor = "blue",
  endColor = "indigo",
  icon: Icon,
  label,
  download = false,
  isExternalLink = false,
}) => {
  const Component = href ? "a" : "button";
  const linkProps = href
    ? {
        href,
        ...(isExternalLink && {
          target: "_blank",
          rel: "noopener noreferrer",
        }),
        ...(download && { download }),
      }
    : {};

  return (
    <Component
      onClick={onClick}
      {...linkProps}
      className={`
        group
        inline-flex items-center px-8 py-4
        bg-gradient-to-r from-${startColor}-500 to-${endColor}-600
        hover:from-${startColor}-600 hover:to-${endColor}-700
        text-white font-medium rounded-2xl
        transition-all duration-300
        hover:shadow-lg
        active:scale-95
        relative
        overflow-hidden
      `}
    >
      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {Icon && <Icon size={20} className="mr-2" />}
      <span className="relative text-lg">{label}</span>
    </Component>
  );
};

export default GradientButton;
