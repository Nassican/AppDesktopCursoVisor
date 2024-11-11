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
  size = "md", // nuevo prop para tamaño: 'sm', 'md', 'lg'
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

  const sizeClasses = {
    sm: "px-6 py-2.5 text-base",
    md: "px-8 py-4 text-lg",
    lg: "px-10 py-5 text-xl",
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <Component
      onClick={onClick}
      {...linkProps}
      className={`
        group
        inline-flex items-center ${sizeClasses[size]}
        bg-gradient-to-r from-${startColor}-500 to-${endColor}-600 
        hover:from-${startColor}-600 hover:to-${endColor}-700
        text-white font-medium rounded-xl
        transition-all duration-300
        hover:shadow-lg
        active:scale-95
        relative text-
        overflow-hidden
      `}
    >
      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      {Icon && <Icon size={iconSizes[size]} className="mr-2" />}
      <span className={`relative`}>{label}</span>
    </Component>
  );
};

export default GradientButton;
