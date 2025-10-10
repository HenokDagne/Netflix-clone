function Sidebar() {
    return (
        <> {/* Left Sidebar: spans navbar row and main row */}
        <aside className="row-span-2 col-start-1 bg-gray-900 border-r border-gray-800 p-6 overflow-y-auto"
        style={{backgroundColor: '#080a0b'}}
        >
          <div className="mb-6 text-2xl font-semibold">Netflix</div>
          <nav className="space-y-3 text-sm text-gray-300">
            <div className="py-2">Home</div>
            <div className="py-2">Watch List</div>
            <div className="py-2">Coming Soon</div>
            <div className="py-2">Discovery</div>
          </nav>
        </aside>

        {/* Navbar: only above the center/main column */}
        </>

       
    );
}

export default Sidebar;