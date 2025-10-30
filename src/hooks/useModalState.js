import { useState, useRef } from "react";

export default function useModalState() {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const filterModalRef = useRef(null);
  const sortModalRef = useRef(null);

  return {
    showFilterModal,
    setShowFilterModal,
    showSortModal,
    setShowSortModal,
    filterModalRef,
    sortModalRef,
  };
}